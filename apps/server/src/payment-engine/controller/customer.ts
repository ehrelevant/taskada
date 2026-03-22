import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';

import { Session as UserSession } from '../../auth';

import { CreateCustomerResponseDto, GetCustomerListResponseDto, GetPaymentChannelsRequestDto, GetPaymentChannelsResponseDto, UpdateCustomerRequestDto, UpdateCustomerResponseDto } from '../dto';
import { path_case } from '../utils';
import { PaymentEngineService } from '../payment-engine.service';

const tag = 'PaymentEngine/Customer';

@ApiTags(tag)
@Controller(path_case(tag))
export class CustomerController {
  constructor(private readonly paymentEngineService: PaymentEngineService) {}

  @Post()
  @ApiOperation({
    summary: 'Create customer',
    description: 'Create a customer record in the payment engine using session data.',
  })
  @ApiResponse({ status: 201, description: 'Customer created', type: CreateCustomerResponseDto })
  // @ApiBody({ type: CreateCustomerRequestDto })
  createCustomer(@Session() session: UserSession): Promise<CreateCustomerResponseDto> {
    return this.paymentEngineService.createCustomer({
      reference_id: session.user.id,
      type: 'INDIVIDUAL',
      individual_detail: {
        given_names: session.user.name,
        surname: session.user.lastName,
      },
      email: session.user.email,
      mobile_number: session.user.phoneNumber,
      date_of_registration: session.user.createdAt.toISOString(),
    });
  }

  @Get('')
  @ApiOperation({
    summary: 'Get customer through authenticated user',
    description: "Retrieve customers matching the authenticated user's id.",
  })
  @ApiResponse({ status: 200, description: 'List of customers', type: GetCustomerListResponseDto })
  getCustomerList(@Session() session: UserSession): Promise<GetCustomerListResponseDto> {
    return this.paymentEngineService.getCustomerList({ reference_id: session.user.id });
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

  @Patch(':customer_id')
  @ApiOperation({ summary: 'Update customer', description: 'Update an existing customer.' })
  @ApiBody({ type: UpdateCustomerRequestDto })
  @ApiResponse({ status: 200, description: 'Customer updated', type: UpdateCustomerResponseDto })
  updateCustomer(
    @Param('customer_id') customer_id: string,
    @Body() body: UpdateCustomerRequestDto,
  ): Promise<UpdateCustomerResponseDto> {
    return this.paymentEngineService.updateCustomer(body);
  }
}
