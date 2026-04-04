import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { Controller, Get, Res } from '@nestjs/common';
import { PrometheusController } from '@willsoto/nestjs-prometheus';
import type { Response } from 'express';

@Controller()
export class MetricsController extends PrometheusController {
  @Get()
  @AllowAnonymous()
  async index(@Res({ passthrough: true }) response: Response) {
    return super.index(response as unknown);
  }
}
