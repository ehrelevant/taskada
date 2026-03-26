import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import {
  CancelSessionRequestDto,
  CancelSessionResponseDto,
  CreateSessionRequestDto,
  CreateSessionResponseDto,
  GetSessionStatusResponseDto,
} from '../dto/session';
import { path_case } from '../utils';
import { PaymentEngineService } from '../payment-engine.service';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { user } from '@repo/database';

const tag = 'PaymentEngine/Session';

@ApiTags(tag)
@Controller(path_case(tag))
export class SessionController {
  constructor(private readonly paymentEngineService: PaymentEngineService) {}

  @Post()
  @ApiOperation({ summary: 'Create session', description: 'Create a payment session in the payment engine.' })
  @ApiResponse({ status: 201, description: 'Session created', type: () => CreateSessionResponseDto })
  createSession(@Session() session: UserSession): Promise<CreateSessionResponseDto> {
    return this.paymentEngineService.createSession(session.user.id);
  }

  @Get(':session_id/status')
  @ApiOperation({ summary: 'Get session status', description: 'Retrieve the status of a session by id.' })
  @ApiParam({ name: 'session_id', description: 'Session id', required: true, example: 'sess-abcdef0123456789' })
  @ApiResponse({ status: 200, description: 'Session status retrieved', type: () => GetSessionStatusResponseDto })
  getSessionStatus(@Param('session_id') session_id: string): Promise<GetSessionStatusResponseDto> {
    return this.paymentEngineService.getSessionStatus({ session_id });
  }

  @Post(':session_id/cancel')
  @ApiOperation({ summary: 'Cancel session', description: 'Cancel an existing payment session.' })
  @ApiResponse({ status: 200, description: 'Session cancelled', type: () => CancelSessionResponseDto })
  cancelSession(@Param("session_id") session_id: string): Promise<CancelSessionResponseDto> {
    return this.paymentEngineService.cancelSession({session_id});
  }

  @Post(':session_id/success')
  @ApiOperation({ summary: 'Callback for Session Success', description: 'Callback for Successful session.'})
  @ApiResponse({ status: 200, description: 'Session cancelled', type: () => CancelSessionResponseDto })
  successSession(@Param("session_id") session_id: string) {
    return this.paymentEngineService.sessionSuccess(session_id);
  }

}
