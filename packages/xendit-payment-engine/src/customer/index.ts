import * as v from 'valibot';
import defaultClient from '@src/client';
import { ErrorResponseSchema } from '@standard/schema';
import { v4 as uuid4 } from 'uuid';

import type {
  CreateCustomerRequest,
  Customer,
  GetCustomerListRequest,
  GetCustomerListResponse,
  GetCustomerRequest,
  UpdateCustomerRequest,
} from './types';
import {
  CreateCustomerRequestSchema,
  CustomerSchema,
  GetCustomerListRequestSchema,
  GetCustomerListResponseSchema,
  GetCustomerRequestSchema,
  UpdateCustomerRequestSchema,
} from './schema';

const client = defaultClient.create({
  headers: {
    'api-version': '2020-10-31',
  },
});

async function get_customer(request: GetCustomerRequest): Promise<Customer> {
  const validated_request = v.parse(GetCustomerRequestSchema, request);
  const response = await client.get(`customers/${validated_request.customer_id}`);

  if (!response.ok) {
    const error_message = v.parse(ErrorResponseSchema, await response.json());
    throw new Error(`Failed to retrieve customer detail due to ${error_message.error_code}`);
  }

  return v.parse(CustomerSchema, await response.json());
}

async function get_customer_list(request: GetCustomerListRequest): Promise<GetCustomerListResponse> {
  const validated_request = v.parse(GetCustomerListRequestSchema, request);
  const response = await client.get('customers', { searchParams: { reference_id: validated_request.reference_id } });
  if (!response.ok) {
    const error_message = v.parse(ErrorResponseSchema, await response.json());
    throw new Error(`Failed to retrieve customer list due to ${error_message.error_code}`);
  }
  return v.parse(GetCustomerListResponseSchema, await response.json());
}

async function create_customer(request: CreateCustomerRequest): Promise<Customer> {
  const validated_request = v.parse(CreateCustomerRequestSchema, request);
  const response = await client.post('customers', {
    body: JSON.stringify(validated_request),
    headers: { 'idempotency-key': uuid4() },
  });
  if (!response.ok) {
    const error_message = v.parse(ErrorResponseSchema, await response.json());
    throw new Error(`Failed to create customer due to ${error_message.error_code}`);
  }
  return v.parse(CustomerSchema, await response.json());
}

async function update_customer(request: UpdateCustomerRequest): Promise<Customer> {
  const validated_request = v.parse(UpdateCustomerRequestSchema, request);
  const response = await client.post('customers', {
    body: JSON.stringify(validated_request),
  });
  if (!response.ok) {
    const error_message = v.parse(ErrorResponseSchema, await response.json());
    throw new Error(`Failed to update customer due to ${error_message.error_code}`);
  }
  return v.parse(CustomerSchema, await response.json());
}

export { get_customer, get_customer_list, create_customer, update_customer };
