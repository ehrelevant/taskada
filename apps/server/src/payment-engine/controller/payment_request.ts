import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';

import {
  CancelPaymentRequestResponseDto,
  GetPaymentRequestStatusResponseDto,
  SimulatePaymentRequestDto,
  SimulatePaymentResponseDto,
} from '../dto';
import { path_case } from '../utils';
import { PaymentEngineService } from '../payment-engine.service';

const tag = 'PaymentEngine/PaymentRequest';

@ApiTags(tag)
@Controller(path_case(tag))
@UseInterceptors(ClassSerializerInterceptor)
export class PaymentRequestController {
  constructor(private readonly paymentEngineService: PaymentEngineService) {}

  @Get(':payment_request_id')
  @ApiOperation({ summary: 'Get payment request status', description: 'Retrieve a payment request by id.' })
  @ApiParam({ name: 'payment_request_id', description: 'Payment Request id', required: true, example: 'pr-...' })
  @ApiResponse({ status: 200, description: 'Payment request retrieved', type: GetPaymentRequestStatusResponseDto })
  getPaymentRequestStatus(
    @Param('payment_request_id') payment_request_id: string,
  ): Promise<GetPaymentRequestStatusResponseDto> {
    return this.paymentEngineService.getPaymentRequestStatus({ payment_request_id });
  }

  @Post(':payment_request_id/cancel')
  @ApiOperation({ summary: 'Cancel payment request', description: 'Cancel an existing payment request.' })
  @ApiParam({ name: 'payment_request_id', description: 'Payment Request id', required: true, example: 'pr-...' })
  @ApiResponse({ status: 200, description: 'Payment request cancelled', type: CancelPaymentRequestResponseDto })
  cancelPaymentRequest(
    @Param('payment_request_id') payment_request_id: string,
  ): Promise<CancelPaymentRequestResponseDto> {
    return this.paymentEngineService.cancelPaymentRequest({ payment_request_id });
  }

  @Post(':payment_request_id/simulate')
  @ApiOperation({ summary: 'Simulate payment', description: 'Simulate a payment for a payment request.' })
  @ApiParam({ name: 'payment_request_id', description: 'Payment Request id', required: true, example: 'pr-...' })
  @ApiBody({ type: SimulatePaymentRequestDto })
  @ApiResponse({ status: 200, description: 'Simulation result', type: SimulatePaymentResponseDto })
  simulatePayment(
    @Param('payment_request_id') payment_request_id: string,
    @Body() body: Partial<SimulatePaymentRequestDto>,
  ): Promise<SimulatePaymentResponseDto> {
    // combine path param and body to form the request expected by the service
    const request = { payment_request_id, ...(body as any) } as any;
    return this.paymentEngineService.simulatePayment(request);
  }
}
