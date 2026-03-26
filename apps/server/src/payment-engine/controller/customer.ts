import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';

import { Session as UserSession } from '../../auth';

import {
  CreateCustomerResponseDto,
  GetCustomerResponseDto,
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
  @ApiOperation({
    summary: 'Create customer through authenticated user',
    description: 'Create a customer record in the payment engine using session data.',
  })
  @ApiResponse({ status: 201, description: 'Customer created', type: CreateCustomerResponseDto })
  createCustomer(@Session() session: UserSession): Promise<CreateCustomerResponseDto> {
    return this.paymentEngineService.createCustomer(session.user.id);
  }

  @Get('')
  @ApiOperation({
    summary: 'Get customer through authenticated user',
    description: "Retrieve customers matching the authenticated user's id.",
  })
  @ApiResponse({ status: 200, description: 'List of customers', type: GetCustomerResponseDto })
  getCustomer(@Session() session: UserSession): Promise<GetCustomerResponseDto> {
    return this.paymentEngineService.getCustomer(session.user.id);
  }

  @Patch('')
  @ApiOperation({ summary: 'Update customer through authenticated user', description: 'Update an existing customer.' })
  @ApiBody({ type: UpdateCustomerRequestDto })
  @ApiResponse({ status: 200, description: 'Customer updated', type: UpdateCustomerResponseDto })
  updateCustomer(
    @Session() session: UserSession,
    @Body() body: UpdateCustomerRequestDto,
  ): Promise<UpdateCustomerResponseDto> {
    return this.paymentEngineService.updateCustomer(session.user.id, body);
  }
}
