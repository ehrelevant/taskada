// Mock environment variables
process.env.XENDIT_API_URL = 'https://api.example.com';
process.env.XENDIT_CLIENT_SECRET = 'mock_secret';

import * as v from 'valibot';
import { jest } from '@jest/globals';
import { mockGet, mockPost, partial_mockKyResponse } from '@src/tests';

import { CancelPaymentResponseSchema, CapturePaymentResponseSchema, GetPaymentStatusResponseSchema } from './schema';

jest.unstable_mockModule('@src/client', () => ({
  default: {
    create: () => ({ post: mockPost, get: mockGet }),
  },
}));

const { capture_payment, cancel_payment, get_payment_status } = await import('./index');

describe('payments/payment', () => {
  it('capture_payment - success', async () => {
    mockPost.mockResolvedValueOnce(
      partial_mockKyResponse({ status: 200, json: async () => SampleCapturePaymentCardsResponse }),
    );
    const req = {
      payment_id: SampleCapturePaymentCardsResponse.payment_id,
      capture_amount: SampleCapturePaymentCardsResponse.captures[0]!.capture_amount,
    };
    const res = await capture_payment(req);
    expect(res).toEqual(v.parse(CapturePaymentResponseSchema, SampleCapturePaymentCardsResponse));
  });

  it('cancel_payment - success', async () => {
    mockPost.mockResolvedValueOnce(
      partial_mockKyResponse({ status: 200, json: async () => SampleCancelPaymentCardsResponse }),
    );
    const req = { payment_id: SampleCancelPaymentCardsResponse.payment_id };
    const res = await cancel_payment(req);
    expect(res).toEqual(v.parse(CancelPaymentResponseSchema, SampleCancelPaymentCardsResponse));
  });

  it('get_payment_status - success', async () => {
    mockGet.mockResolvedValueOnce(
      partial_mockKyResponse({ status: 200, json: async () => SampleGetPaymentRedirectResponse }),
    );
    const req = { payment_id: SampleGetPaymentRedirectResponse.payment_id };
    const res = await get_payment_status(req);
    expect(res).toEqual(v.parse(GetPaymentStatusResponseSchema, SampleGetPaymentRedirectResponse));
  });

  it('capture_payment - API error', async () => {
    mockPost.mockResolvedValueOnce(
      partial_mockKyResponse({
        status: 400,
        json: async () => ({ error_code: 'INVALID_REQUEST', message: 'Bad request', errors: [] }),
      }),
    );
    await expect(
      capture_payment({ payment_id: 'py-1402feb0-bb79-47ae-9d1e-e69394d3949c', capture_amount: 1000 }),
    ).rejects.toThrow();
  });

  it('cancel_payment - API error', async () => {
    mockPost.mockResolvedValueOnce(
      partial_mockKyResponse({
        status: 403,
        json: async () => ({ error_code: 'FORBIDDEN', message: 'Forbidden', errors: [] }),
      }),
    );
    await expect(cancel_payment({ payment_id: 'py-1402feb0-bb79-47ae-9d1e-e69394d3949c' })).rejects.toThrow();
  });

  it('get_payment_status - API error', async () => {
    mockGet.mockResolvedValueOnce(
      partial_mockKyResponse({
        status: 404,
        json: async () => ({ error_code: 'NOT_FOUND', message: 'Not found', errors: [] }),
      }),
    );
    await expect(get_payment_status({ payment_id: 'py-1402feb0-bb79-47ae-9d1e-e69394d3949c' })).rejects.toThrow();
  });
});
const SampleCapturePaymentCardsResponse = {
  payment_id: 'py-1402feb0-bb79-47ae-9d1e-e69394d3949c',
  business_id: '5f27a14a9bf05c73dd040bc8',
  reference_id: '90392f42-d98a-49ef-a7f3-abcezas123',
  payment_request_id: 'pr-1102feb0-bb79-47ae-9d1e-e69394d3949c',
  payment_token_id: 'pt-cc3938dc-c2a5-43c4-89d7-7570793348c2',
  customer_id: 'cust-b98d6f63-d240-44ec-9bd5-aa42954c4f48',
  type: 'PAY',
  country: 'ID',
  currency: 'IDR',
  request_amount: 1999.01,
  capture_method: 'AUTOMATIC',
  channel_code: 'CARDS',
  channel_properties: {
    mid_label: 'CTV_TEST',
    card_details: {
      type: 'CREDIT',
      issuer: 'BRI',
      country: 'ID',
      network: 'VISA',
      fingerprint: '61f632879e9e27001a8165b9',
      masked_card_number: '2222XXXXXXXX8888',
      expiry_year: '2027',
      expiry_month: '12',
      cardholder_first_name: 'John',
      cardholder_last_name: 'Doe',
      cardholder_email: 'john.doe@example.com',
      cardholder_phone_number: '+6212345678904',
    },
    skip_three_ds: false,
    card_on_file_type: 'CUSTOMER_UNSCHEDULED',
    failure_return_url: 'https://xendit.co/failure',
    success_return_url: 'https://xendit.co/success',
    billing_information: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone_number: '+6212345678904',
      city: 'Singapore',
      country: 'SG',
      postal_code: '644228',
      street_line1: 'Merlion Bay Sands Suites',
      street_line2: '21-37',
      province_state: 'Singapore',
    },
    statement_descriptor: 'Goods & Services',
    recurring_configuration: {
      recurring_expiry: '2025-12-31',
      recurring_frequency: 30,
    },
  },
  captures: [
    {
      capture_timestamp: '2029-12-31T23:59:59Z',
      capture_id: 'cap-1502feb0-bb79-47ae-9d1e-e69394d3949c',
      capture_amount: 1999.01,
    },
  ],
  status: 'SUCCEEDED',
  payment_details: {
    authentication_data: {
      flow: 'FULL_AUTH',
      a_res: {
        eci: '05',
        message_version: '02',
        authentication_value: 'AUTHVAR',
        ds_trans_id: 'sample_trans_id',
      },
    },
    authorization_data: {
      authorization_code: 'A1B2C3',
      cvn_verification_result: 'M',
      address_verification_result: 'M',
      retrieval_reference_number: 'akjsdiuh132127y9sacsdjn',
      network_response_code: '00',
      network_response_code_descriptor: 'testing',
      network_transaction_id: 'dahskjdhiquh341',
      acquirer_merchant_id: 'alskdnuoqh341',
      reconciliation_id: 'oiajsdo1823938yrh2',
    },
  },
  metadata: {
    invoice_id: 'INV-2025-001',
    customer_type: 'business',
  },
  created: '2029-12-31T23:59:59Z',
  updated: '2029-12-31T23:59:59Z',
};

const SampleCancelPaymentCardsResponse = {
  payment_id: 'py-1402feb0-bb79-47ae-9d1e-e69394d3949c',
  business_id: '5f27a14a9bf05c73dd040bc8',
  reference_id: '90392f42-d98a-49ef-a7f3-abcezas123',
  payment_request_id: 'pr-1102feb0-bb79-47ae-9d1e-e69394d3949c',
  payment_token_id: 'pt-cc3938dc-c2a5-43c4-89d7-7570793348c2',
  customer_id: 'cust-b98d6f63-d240-44ec-9bd5-aa42954c4f48',
  type: 'PAY',
  country: 'ID',
  currency: 'IDR',
  request_amount: 1999.01,
  capture_method: 'AUTOMATIC',
  channel_code: 'CARDS',
  channel_properties: {
    mid_label: 'CTV_TEST',
    card_details: {
      type: 'CREDIT',
      issuer: 'BRI',
      country: 'ID',
      network: 'VISA',
      fingerprint: '61f632879e9e27001a8165b9',
      masked_card_number: '2222XXXXXXXX8888',
      expiry_year: '2027',
      expiry_month: '12',
      cardholder_first_name: 'John',
      cardholder_last_name: 'Doe',
      cardholder_email: 'john.doe@example.com',
      cardholder_phone_number: '+6212345678904',
    },
    skip_three_ds: false,
    card_on_file_type: 'CUSTOMER_UNSCHEDULED',
    failure_return_url: 'https://xendit.co/failure',
    success_return_url: 'https://xendit.co/success',
    billing_information: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone_number: '+6212345678904',
      city: 'Singapore',
      country: 'SG',
      postal_code: '644228',
      street_line1: 'Merlion Bay Sands Suites',
      street_line2: '21-37',
      province_state: 'Singapore',
    },
    statement_descriptor: 'Goods & Services',
    recurring_configuration: {
      recurring_expiry: '2025-12-31',
      recurring_frequency: 30,
    },
  },
  status: 'CANCELED',
  payment_details: {
    authentication_data: {
      flow: 'FULL_AUTH',
      a_res: {
        eci: '05',
        message_version: '02',
        authentication_value: 'AUTHVAR',
        ds_trans_id: 'sample_trans_id',
      },
    },
    authorization_data: {
      authorization_code: 'A1B2C3',
      cvn_verification_result: 'M',
      address_verification_result: 'M',
      retrieval_reference_number: 'akjsdiuh132127y9sacsdjn',
      network_response_code: '00',
      network_response_code_descriptor: 'testing',
      network_transaction_id: 'dahskjdhiquh341',
      acquirer_merchant_id: 'alskdnuoqh341',
      reconciliation_id: 'oiajsdo1823938yrh2',
    },
  },
  metadata: {
    invoice_id: 'INV-2025-001',
    customer_type: 'business',
  },
  created: '2029-12-31T23:59:59Z',
  updated: '2029-12-31T23:59:59Z',
};

const SampleGetPaymentRedirectResponse = {
  payment_id: 'py-1402feb0-bb79-47ae-9d1e-e69394d3949c',
  business_id: '5f27a14a9bf05c73dd040bc8',
  reference_id: '90392f42-d98a-49ef-a7f3-abcezas123',
  payment_request_id: 'pr-1102feb0-bb79-47ae-9d1e-e69394d3949c',
  payment_token_id: 'pt-cc3938dc-c2a5-43c4-89d7-7570793348c2',
  customer_id: 'cust-b98d6f63-d240-44ec-9bd5-aa42954c4f48',
  type: 'PAY',
  country: 'ID',
  currency: 'IDR',
  request_amount: 1999.01,
  capture_method: 'AUTOMATIC',
  channel_code: 'OVO',
  channel_properties: {
    success_return_url: 'https://xendit.co/success',
  },
  captures: [
    {
      capture_timestamp: '2029-12-31T23:59:59Z',
      capture_id: 'cap-1502feb0-bb79-47ae-9d1e-e69394d3949c',
      capture_amount: 1999.01,
    },
  ],
  status: 'SUCCEEDED',
  payment_details: {
    remark: 'example remark',
  },
  metadata: {
    invoice_id: 'INV-2025-001',
    customer_type: 'business',
  },
  created: '2029-12-31T23:59:59Z',
  updated: '2029-12-31T23:59:59Z',
};
