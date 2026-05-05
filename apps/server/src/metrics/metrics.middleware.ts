import { Histogram } from 'prom-client';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { NextFunction, Request, Response } from 'express';

import loggerInstance from '../logger';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  private logger = loggerInstance;
  constructor(
    @InjectMetric('http_request_duration_seconds')
    private readonly histogram: Histogram<string>,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    // 1. Skip the metrics endpoint
    if (originalUrl.includes('/metrics')) {
      return next();
    }

    // 2. Start the timer
    const stopTimer = this.histogram.startTimer();

    // 3. Wait for the response to finish
    res.on('finish', () => {
      // Build a route template when available. For controller routes
      // Express sets `req.baseUrl` (router prefix) and `req.route.path`.
      // If those are missing (unmatched 404s, static files, etc.),
      // fall back to the original URL without query params.
      let routePath: string | undefined;
      if (req.route && typeof (req.route as { path?: unknown }).path === 'string') {
        routePath = (req.route as { path: string }).path;
      } else {
        routePath = undefined;
      }

      const base = req.baseUrl && req.baseUrl !== '/' ? req.baseUrl : '';
      const path = routePath ? `${base}${routePath}` : originalUrl.split('?')[0] || req.url || 'unknown_route';
      const statusCode = res.statusCode;

      this.logger.debug({
        method,
        path,
        status: statusCode,
        msg: `Prometheus recording: ${method} ${path}`,
      });

      // 4. Record the metric
      stopTimer({
        method,
        url: path,
        status: statusCode,
      });
    });

    next();
  }
}
