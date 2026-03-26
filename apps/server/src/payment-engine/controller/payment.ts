import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { CapturePaymentRequest, CreateRefundRequest } from '@repo/xendit-payment-engine';

import {
  CancelPaymentResponseDto,
  CapturePaymentRequestDto,
  CapturePaymentResponseDto,
  CreateRefundRequestDto,
  CreateRefundResponseDto,
  GetPaymentStatusResponseDto,
} from '../dto';
import { path_case } from '../utils';
import { PaymentEngineService } from '../payment-engine.service';

const tag = 'PaymentEngine/Payment';

@ApiTags(tag)
@Controller(path_case(tag))
export class PaymentController {
  constructor(private readonly paymentEngineService: PaymentEngineService) {}

  @Get(':payment_id/status')
  @ApiOperation({ summary: 'Get payment status', description: 'Retrieve the status of a payment by id.' })
  @ApiParam({ name: 'payment_id', description: 'Payment id', required: true, example: 'pay-123' })
  @ApiResponse({ status: 200, description: 'Payment status', type: GetPaymentStatusResponseDto })
  getPaymentStatus(@Param('payment_id') payment_id: string) {
    return this.paymentEngineService.getPaymentStatus({ payment_id });
  }

  @Post('capture')
  @ApiOperation({ summary: 'Capture payment', description: 'Capture a previously authorized payment.' })
  @ApiBody({ type: CapturePaymentRequestDto })
  @ApiResponse({ status: 200, description: 'Capture result', type: CapturePaymentResponseDto })
  capturePayment(@Body() body: CapturePaymentRequestDto): Promise<CapturePaymentResponseDto> {
    return this.paymentEngineService.capturePayment(body as unknown as CapturePaymentRequest);
  }

  @Post(':payment_id/cancel')
  @ApiOperation({ summary: 'Cancel payment', description: 'Cancel a payment by id.' })
  @ApiParam({ name: 'payment_id', description: 'Payment id', required: true, example: 'pay-123' })
  @ApiResponse({ status: 200, description: 'Cancel result', type: CancelPaymentResponseDto })
  cancelPayment(@Param('payment_id') payment_id: string): Promise<CancelPaymentResponseDto> {
    return this.paymentEngineService.cancelPayment({ payment_id });
  }

  @Post('refund')
  @ApiOperation({ summary: 'Refund payment', description: 'Create a refund for a payment.' })
  @ApiBody({ type: CreateRefundRequestDto })
  @ApiResponse({ status: 200, description: 'Refund created', type: CreateRefundResponseDto })
  refundPayment(@Body() body: CreateRefundRequestDto): Promise<CreateRefundResponseDto> {
    return this.paymentEngineService.refundPayment(body as unknown as CreateRefundRequest);
  }

  @Get('token/:payment_token_id')
  getPaymentTokenStatus(@Param('payment_token_id') payment_token_id: string) {
    return this.paymentEngineService.getPaymentTokenStatus({ payment_token_id });
  }
}
