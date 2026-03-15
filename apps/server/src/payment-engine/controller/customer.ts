import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';

import {
  CreateCustomerRequestDto,
  CreateCustomerResponseDto,
  GetCustomerListResponseDto,
  GetCustomerResponseDto,
  GetPaymentChannelsRequestDto,
  GetPaymentChannelsResponseDto,
  UpdateCustomerRequestDto,
  UpdateCustomerResponseDto,
} from '../dto';
import { path_case } from '../utils';
import { PaymentEngineService } from '../payment-engine.service';

const tag = 'PaymentEngine/Customer';

@ApiTags(tag)
@Controller(path_case(tag))
export class CustomerController {
  constructor(private readonly paymentEngineService: PaymentEngineService) {}

  @Post()
  @ApiOperation({ summary: 'Create customer', description: 'Create a customer record in the payment engine.' })
  @ApiResponse({ status: 201, description: 'Customer created', type: CreateCustomerResponseDto })
  @ApiBody({ type: CreateCustomerRequestDto })
  createCustomer(@Body() body: CreateCustomerRequestDto): Promise<CreateCustomerResponseDto> {
    return this.paymentEngineService.createCustomer(body);
  }

  @Get(':customer_id')
  @ApiOperation({ summary: 'Get customer', description: 'Retrieve a customer by Xendit customer id.' })
  @ApiParam({
    name: 'customer_id',
    description: 'Xendit customer id',
    required: true,
    example: 'cust-abcdef0123456789',
  })
  @ApiResponse({ status: 200, description: 'Customer retrieved', type: GetCustomerResponseDto })
  getCustomer(@Param('customer_id') customer_id: string): Promise<GetCustomerResponseDto> {
    return this.paymentEngineService.getCustomer({ customer_id });
  }

  @Get(':reference_id')
  @ApiOperation({
    summary: 'Get customer list by reference id',
    description: 'Retrieve customers matching the provided merchant reference id.',
  })
  @ApiParam({
    name: 'reference_id',
    description: 'Merchant reference id associated with customers',
    required: true,
    example: 'ref-123',
  })
  @ApiResponse({ status: 200, description: 'List of customers', type: GetCustomerListResponseDto })
  getCustomerList(@Param('reference_id') reference_id: string): Promise<GetCustomerListResponseDto> {
    return this.paymentEngineService.getCustomerList({ reference_id });
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

  @Patch('update')
  @ApiOperation({ summary: 'Update customer', description: 'Update an existing customer.' })
  @ApiBody({ type: UpdateCustomerRequestDto })
  @ApiResponse({ status: 200, description: 'Customer updated', type: UpdateCustomerResponseDto })
  updateCustomer(@Body() body: UpdateCustomerRequestDto): Promise<UpdateCustomerResponseDto> {
    return this.paymentEngineService.updateCustomer(body);
  }
}
