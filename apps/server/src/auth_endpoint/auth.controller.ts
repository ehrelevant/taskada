import { _statusCode } from 'better-call';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

import { auth } from '../auth';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthEndpointController {
  @Post('register')
  @HttpCode(200)
  @ApiOperation({ summary: 'Register (email + password)' })
  @ApiBody({ description: 'Registration payload', required: true, type: RegisterDto })
  @ApiResponse({ status: 200, description: 'User registered' })
  @AllowAnonymous()
  async register(@Req() req: Request, @Res() res: Response) {
    try {
      const handler = auth.api?.signUpEmail;
      if (!handler) {
        return res.status(501).json({ message: 'Register endpoint not available' });
      }
      console.warn(req);
      const result = await handler({ body: req.body, headers: Object(req.headers), returnHeaders: true });
      if (result?.headers instanceof Headers) {
        result.headers.forEach((v: any, k: string) => res.setHeader(k, v));
      }
      return res.json(result?.response ?? result);
    } catch (err: any) {
      // better-call APIError may set `status` as a string key like "BAD_REQUEST"
      // and `statusCode` as the numeric HTTP code. Prefer numeric values.
      const status =
        typeof err?.statusCode === 'number'
          ? err.statusCode
          : typeof err?.status === 'number'
            ? err.status
            : typeof err?.status === 'string'
              ? ((_statusCode as any)[err.status] ?? 400)
              : 400;
      return res.status(status).json({ message: err?.message ?? 'Registration failed', details: err?.details });
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
      const handler = (auth as any).api?.signInEmail;
      if (!handler) {
        return res.status(501).json({ message: 'Login endpoint not available' });
      }
      const result = await handler({ body: req.body, headers: req.headers, returnHeaders: true });
      if (result?.headers instanceof Headers) {
        result.headers.forEach((v: any, k: string) => res.setHeader(k, v));
      }
      return res.json(result?.response ?? result);
    } catch (err: any) {
      const status =
        typeof err?.statusCode === 'number'
          ? err.statusCode
          : typeof err?.status === 'number'
            ? err.status
            : typeof err?.status === 'string'
              ? ((_statusCode as any)[err.status] ?? 400)
              : 400;
      return res.status(status).json({ message: err?.message ?? 'Login failed', details: err?.details });
    }
  }
}
