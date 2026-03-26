import { _statusCode } from 'better-call';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

import { auth } from '../auth';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type HandlerResult<ResponseBody = unknown> = { response?: ResponseBody; headers?: Headers } | ResponseBody;
type SignArgs = { body: unknown; headers: Record<string, unknown>; returnHeaders?: boolean };
type SignHandler = (args: SignArgs) => Promise<HandlerResult>;

const getStatusFromError = (err: unknown): number => {
  if (typeof err === 'object' && err !== null) {
    const e = err as Record<string, unknown>;
    if (typeof e.statusCode === 'number') return e.statusCode;
    if (typeof e.status === 'number') return e.status;
    if (typeof e.status === 'string') return (_statusCode as Record<string, number>)[e.status] ?? 400;
  }
  return 400;
};

const extractMessageAndDetails = (err: unknown, defaultMsg: string) => {
  let message = defaultMsg;
  let details: unknown = undefined;
  if (typeof err === 'object' && err !== null) {
    const e = err as Record<string, unknown>;
    if (typeof e.message === 'string') message = e.message;
    if ('details' in e) details = e.details;
  }
  return { message, details };
};

const getHandlerFromAuth = (key: 'signUpEmail' | 'signInEmail'): SignHandler | undefined => {
  const a = auth as unknown as { api?: Record<string, unknown> | undefined };
  const api = a.api as Record<string, unknown> | undefined;
  if (!api) return undefined;
  const maybe = api[key];
  return typeof maybe === 'function' ? (maybe as SignHandler) : undefined;
};

@ApiTags('Auth')
@Controller('auth')
export class AuthEndpointController {
  // Local types to avoid using `any`

  @Post('register')
  @HttpCode(200)
  @ApiOperation({ summary: 'Register (email + password)' })
  @ApiBody({ description: 'Registration payload', required: true, type: RegisterDto })
  @ApiResponse({ status: 200, description: 'User registered' })
  @AllowAnonymous()
  async register(@Req() req: Request, @Res() res: Response) {
    try {
      const handler = getHandlerFromAuth('signUpEmail');
      if (!handler) {
        return res.status(501).json({ message: 'Register endpoint not available' });
      }
      console.warn(req);
      const result = await handler({
        body: req.body,
        headers: Object(req.headers) as Record<string, unknown>,
        returnHeaders: true,
      });
      if (typeof result === 'object' && result !== null) {
        const r = result as Record<string, unknown>;
        if (r.headers instanceof Headers) {
          r.headers.forEach((v: string, k: string) => res.setHeader(k, v));
        }
        if ('response' in r) return res.json(r.response);
      }
      return res.json(result as unknown);
    } catch (err) {
      const status = getStatusFromError(err);
      const { message, details } = extractMessageAndDetails(err, 'Registration failed');
      return res.status(status).json({ message, details });
    }
  }

  @Post('login')
  @HttpCode(200)
  @AllowAnonymous()
  @ApiOperation({ summary: 'Login (email + password)' })
  @ApiBody({ description: 'Login payload', required: true, type: LoginDto })
  @ApiResponse({ status: 200, description: 'Logged in' })
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const handler = getHandlerFromAuth('signInEmail');
      if (!handler) return res.status(501).json({ message: 'Login endpoint not available' });
      const result = await handler({
        body: req.body,
        headers: req.headers as Record<string, unknown>,
        returnHeaders: true,
      });
      if (typeof result === 'object' && result !== null) {
        const r = result as Record<string, unknown>;
        if (r.headers instanceof Headers) r.headers.forEach((v: string, k: string) => res.setHeader(k, v));
        if ('response' in r) return res.json(r.response);
      }
      return res.json(result as unknown);
    } catch (err) {
      const status = getStatusFromError(err);
      const { message, details } = extractMessageAndDetails(err, 'Login failed');
      return res.status(status).json({ message, details });
    }
  }
}
