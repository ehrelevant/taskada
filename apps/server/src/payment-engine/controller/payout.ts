import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import type {
  CancelPayoutRequest,
  CreatePayoutRequest,
  GetPayoutRequest,
  ListPayoutsRequest,
} from '@repo/xendit-payment-engine';

import {
  CancelPayoutRequestDto,
  CancelPayoutResponseDto,
  CreatePayoutRequestDto,
  CreatePayoutResponseDto,
  GetPaymentChannelsRequestDto,
  GetPaymentChannelsResponseDto,
  GetPayoutRequestDto,
  GetPayoutResponseDto,
  ListPayoutsRequestDto,
  ListPayoutsResponseDto,
} from '../dto';
import { path_case } from '../utils';
import { PaymentEngineService } from '../payment-engine.service';

const tag = 'PaymentEngine/Payout';

@ApiTags(tag)
@Controller(path_case(tag))
export class PayoutController {
  constructor(private readonly paymentEngineService: PaymentEngineService) {}

  @Post()
  @ApiOperation({ summary: 'Create payout', description: 'Create a payout to a channel.' })
  @ApiBody({ type: CreatePayoutRequestDto })
  @ApiResponse({ status: 201, description: 'Payout created', type: CreatePayoutResponseDto })
  createPayout(@Body() body: CreatePayoutRequestDto): Promise<CreatePayoutResponseDto> {
    return this.paymentEngineService.createPayout(body as unknown as CreatePayoutRequest);
  }

  @Post('cancel')
  @ApiOperation({ summary: 'Cancel payout', description: 'Cancel an existing payout.' })
  @ApiBody({ type: CancelPayoutRequestDto })
  @ApiResponse({ status: 200, description: 'Payout cancelled', type: CancelPayoutResponseDto })
  cancelPayout(@Body() body: CancelPayoutRequestDto): Promise<CancelPayoutResponseDto> {
    return this.paymentEngineService.cancelPayout(body as unknown as CancelPayoutRequest);
  }

  @Post('get')
  @ApiOperation({ summary: 'Get payout', description: 'Retrieve a payout by id.' })
  @ApiBody({ type: GetPayoutRequestDto })
  @ApiResponse({ status: 200, description: 'Payout retrieved', type: GetPayoutResponseDto })
  getPayout(@Body() body: GetPayoutRequestDto): Promise<GetPayoutResponseDto> {
    return this.paymentEngineService.getPayout(body as unknown as GetPayoutRequest);
  }

  @Post('by-reference')
  @ApiOperation({
    summary: 'List payouts by reference id',
    description: 'List payouts filtered by merchant reference id.',
  })
  @ApiBody({ type: ListPayoutsRequestDto })
  @ApiResponse({ status: 200, description: 'List of payouts', type: ListPayoutsResponseDto })
  getPayoutByReferenceId(@Body() body: ListPayoutsRequestDto): Promise<ListPayoutsResponseDto> {
    return this.paymentEngineService.getPayoutByReferenceId(body as unknown as ListPayoutsRequest);
  }

  @Get('channels')
  @ApiOperation({
    summary: 'List payment channels',
    description: 'Return available payment channels, optionally filtered by name, category or code.',
  })
  @ApiQuery({
    name: 'channel_name',
    required: false,
    description: 'Filter by channel friendly name',
    schema: { type: 'string', example: 'BCA' },
  })
  @ApiQuery({
    name: 'channel_category',
    required: false,
    description: 'Filter by channel category',
    schema: { type: 'string', enum: ['BANK', 'EWALLET', 'OTC'] },
  })
  @ApiQuery({
    name: 'channel_code',
    required: false,
    description: 'Filter by provider channel code',
    schema: { type: 'string', example: 'bca_va' },
  })
  @ApiResponse({ status: 200, description: 'Payment channels list', type: GetPaymentChannelsResponseDto })
  getPaymentChannels(@Query() query: GetPaymentChannelsRequestDto): Promise<GetPaymentChannelsResponseDto> {
    return this.paymentEngineService.getPaymentChannels(query);
  }
}
