import defaultClient from '@src/client';
import { v4 as uuid4 } from 'uuid';

import type {
  CreateCustomerRequest,
  CreateCustomerResponse,
  GetCustomerListRequest,
  GetCustomerListResponse,
  GetCustomerRequest,
  GetCustomerResponse,
  UpdateCustomerRequest,
  UpdateCustomerResponse,
} from './types';
import {
  CreateCustomerRequestSchema,
  CustomerSchema,
  GetCustomerListRequestSchema,
  GetCustomerListResponseSchema,
  GetCustomerRequestSchema,
  UpdateCustomerRequestSchema,
} from './schema';

const client = defaultClient.extend({
  headers: {
    'api-version': '2020-10-31',
  },
});

async function get_customer(request: GetCustomerRequest): Promise<GetCustomerResponse> {
  const validated_request = GetCustomerRequestSchema.parse(request);
  const response = await client.get(`customers/${validated_request.customer_id}`);

  return CustomerSchema.parse(await response.json());
}

async function get_customer_list(request: GetCustomerListRequest): Promise<GetCustomerListResponse> {
  const validated_request = GetCustomerListRequestSchema.parse(request);
  const response = await client.get('customers', { searchParams: { reference_id: validated_request.reference_id } });

  return GetCustomerListResponseSchema.parse(await response.json());
}

async function create_customer(request: CreateCustomerRequest): Promise<CreateCustomerResponse> {
  const validated_request = CreateCustomerRequestSchema.parse(request);
  const response = await client.post('customers', {
    body: JSON.stringify(validated_request),
    headers: { 'idempotency-key': uuid4() },
  });
  return CustomerSchema.parse(await response.json());
}

async function update_customer(request: UpdateCustomerRequest): Promise<UpdateCustomerResponse> {
  const validated_request = UpdateCustomerRequestSchema.parse(request);
  const { customer_id, ...body } = validated_request as unknown as { customer_id: string } & Record<string, unknown>;
  const response = await client.patch(`customers/${customer_id}`, {
    body: JSON.stringify(body),
  });

  return CustomerSchema.parse(await response.json());
}

export { get_customer, get_customer_list, create_customer, update_customer };
