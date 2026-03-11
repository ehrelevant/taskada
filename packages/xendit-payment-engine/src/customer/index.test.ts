// Mock environment variables
process.env.XENDIT_API_URL = 'https://api.example.com';
process.env.XENDIT_CLIENT_SECRET = 'mock_secret';

import * as v from 'valibot';
import { jest } from '@jest/globals';
import { mockGet, mockPost, partial_mockKyResponse } from '@src/tests';

import { CustomerSchema, GetCustomerListResponseSchema } from './schema/index';
jest.unstable_mockModule('@src/client', () => ({
  default: {
    create: () => ({ post: mockPost, get: mockGet }),
  },
}));

const { get_customer, get_customer_list, create_customer } = await import('.');

describe('get_customer', () => {
  it('should return parsed customer', async () => {
    const mockCustomer = {
      id: 'cust-ff2eea08-ed31-440e-8411-75bf64d691be',
      reference_id: '69a2bab89b9e1c193978c114',
      type: 'BUSINESS',
      mobile_number: null,
      phone_number: null,
      individual_detail: null,
      business_detail: {
        business_name: 'Taskada',
        trading_name: null,
        business_type: null,
        nature_of_business: null,
        business_domicile: 'PH',
        date_of_registration: null,
      },
      identity_accounts: [],
      kyc_documents: [],
      addresses: [
        {
          country: 'PH',
          street_line1: '-',
          street_line2: null,
          city: null,
          province_state: null,
          postal_code: null,
          category: null,
          is_primary: true,
        },
      ],
      hashed_phone_number: null,
      created: '2026-02-28T09:52:59.225Z',
      updated: '2026-02-28T09:52:59.225Z',
      metadata: null,
      date_of_registration: null,
      description: null,
    };

    mockGet.mockResolvedValueOnce(partial_mockKyResponse({ status: 200, json: async () => mockCustomer }));

    const result = await get_customer({ customer_id: 'cust-123' });
    expect(result).toEqual(v.parse(CustomerSchema, mockCustomer));
  });

  it('should throw if customer response fails schema', async () => {
    // Missing required fields, e.g. 'id'
    const invalidCustomer = { foo: 'bar' };
    mockGet.mockResolvedValueOnce(partial_mockKyResponse({ status: 200, json: async () => invalidCustomer }));
    await expect(get_customer({ customer_id: 'cust-123' })).rejects.toThrow();
  });

  it('should throw with API error when response is not ok', async () => {
    mockGet.mockResolvedValueOnce(
      partial_mockKyResponse({
        status: 400,
        json: async () => ({ error_code: 'INVALID_REQUEST', message: 'Bad request', errors: [] }),
      }),
    );
    await expect(get_customer({ customer_id: 'cust-123' })).rejects.toThrow(
      'Failed to retrieve customer detail due to INVALID_REQUEST',
    );
  });
});

describe('get_customer_list', () => {
  it('should return a parsed response', async () => {
    const mock_customer_list = {
      data: [
        {
          id: 'cust-ff2eea08-ed31-440e-8411-75bf64d691be',
          reference_id: '69a2bab89b9e1c193978c114',
          type: 'BUSINESS',
          mobile_number: null,
          phone_number: null,
          individual_detail: null,
          business_detail: {
            business_name: 'Taskada',
            trading_name: null,
            business_type: null,
            nature_of_business: null,
            business_domicile: 'PH',
            date_of_registration: null,
          },
          identity_accounts: [],
          kyc_documents: [],
          addresses: [
            {
              country: 'PH',
              street_line1: '-',
              street_line2: null,
              city: null,
              province_state: null,
              postal_code: null,
              category: null,
              is_primary: true,
            },
          ],
          hashed_phone_number: null,
          created: '2026-02-28T09:52:59.225Z',
          updated: '2026-02-28T09:52:59.225Z',
          metadata: null,
          date_of_registration: null,
          description: null,
        },
      ],
      has_more: false,
    };
    mockGet.mockResolvedValueOnce(partial_mockKyResponse({ status: 200, json: async () => mock_customer_list }));

    const result = await get_customer_list({ reference_id: '69a2bab89b9e1c193978c114' });
    expect(result).toEqual(v.parse(GetCustomerListResponseSchema, mock_customer_list));
  });

  it('should throw if customer list response fails schema', async () => {
    // Missing required fields, e.g. 'data' array
    const invalidList = { foo: 'bar' };
    mockGet.mockResolvedValueOnce(partial_mockKyResponse({ status: 200, json: async () => invalidList }));
    await expect(get_customer_list({ reference_id: '69a2bab89b9e1c193978c114' })).rejects.toThrow();
  });

  it('should throw with API error when list response is not ok', async () => {
    mockGet.mockResolvedValueOnce(
      partial_mockKyResponse({
        status: 401,
        json: async () => ({ error_code: 'UNAUTHORIZED', message: 'Not authorized', errors: [] }),
      }),
    );
    await expect(get_customer_list({ reference_id: '69a2bab89b9e1c193978c114' })).rejects.toThrow(
      'Failed to retrieve customer list due to UNAUTHORIZED',
    );
  });
});

describe('create_customer', () => {
  it('should create and return parsed customer', async () => {
    const createRequest = {
      individual_detail: {
        given_names: 'Task',
        surname: null,
        nationality: null,
        place_of_birth: null,
        date_of_birth: null,
        gender: null,
        employment: null,
      },
      business_detail: {
        business_name: 'Taskada',
        trading_name: null,
        business_type: null,
        nature_of_business: null,
        business_domicile: 'PH',
        date_of_registration: null,
      },
      mobile_number: null,
      phone_number: null,
      email: null,
      addresses: {
        country: 'PH',
        street_line1: '-',
        street_line2: null,
        city: null,
        province_state: null,
        postal_code: null,
        category: null,
        is_primary: true,
      },
      kyc_documents: [],
      description: null,
      date_of_registration: null,
      domicile_of_registration: 'PH',
      metadata: null,
    };

    const mockCustomer = {
      id: 'cust-ff2eea08-ed31-440e-8411-75bf64d691be',
      reference_id: '69a2bab89b9e1c193978c114',
      type: 'BUSINESS',
      mobile_number: null,
      phone_number: null,
      individual_detail: null,
      business_detail: {
        business_name: 'Taskada',
        trading_name: null,
        business_type: null,
        nature_of_business: null,
        business_domicile: 'PH',
        date_of_registration: null,
      },
      identity_accounts: [],
      kyc_documents: [],
      addresses: [
        {
          country: 'PH',
          street_line1: '-',
          street_line2: null,
          city: null,
          province_state: null,
          postal_code: null,
          category: null,
          is_primary: true,
        },
      ],
      hashed_phone_number: null,
      created: '2026-02-28T09:52:59.225Z',
      updated: '2026-02-28T09:52:59.225Z',
      metadata: null,
      date_of_registration: null,
      description: null,
    };

    mockPost.mockResolvedValueOnce(partial_mockKyResponse({ status: 201, json: async () => mockCustomer }));

    const result = await create_customer(createRequest);
    expect(result).toEqual(v.parse(CustomerSchema, mockCustomer));
  });

  it('should throw with API error when create response is not ok', async () => {
    mockPost.mockResolvedValueOnce(
      partial_mockKyResponse({
        status: 400,
        json: async () => ({ error_code: 'INVALID_REQUEST', message: 'Bad request', errors: [] }),
      }),
    );
    const minimalRequest = {
      individual_detail: {
        given_names: 'Task',
        surname: null,
        nationality: null,
        place_of_birth: null,
        date_of_birth: null,
        gender: null,
        employment: null,
      },
      business_detail: {
        business_name: 'Taskada',
        trading_name: null,
        business_type: null,
        nature_of_business: null,
        business_domicile: 'PH',
        date_of_registration: null,
      },
      mobile_number: null,
      phone_number: null,
      email: null,
      addresses: {
        country: 'PH',
        street_line1: '-',
        street_line2: null,
        city: null,
        province_state: null,
        postal_code: null,
        category: null,
        is_primary: true,
      },
      kyc_documents: [],
      description: null,
      date_of_registration: null,
      domicile_of_registration: 'PH',
      metadata: null,
    };

    await expect(create_customer(minimalRequest)).rejects.toThrow('Failed to create customer due to INVALID_REQUEST');
  });
});

describe('update_customer', () => {
  it('should update and return parsed customer', async () => {
    const updateRequest = {
      individual_detail: {
        given_names: 'Task',
        surname: null,
        nationality: null,
        place_of_birth: null,
        date_of_birth: null,
        gender: null,
        employment: null,
      },
      business_detail: {
        business_name: 'Taskada',
        trading_name: null,
        business_type: null,
        nature_of_business: null,
        business_domicile: 'PH',
        date_of_registration: null,
      },
      mobile_number: null,
      phone_number: null,
      email: null,
      addresses: {
        country: 'PH',
        street_line1: '-',
        street_line2: null,
        city: null,
        province_state: null,
        postal_code: null,
        category: null,
        is_primary: true,
      },
      kyc_documents: [],
      description: null,
      date_of_registration: null,
      domicile_of_registration: 'PH',
      metadata: null,
    };

    const updatedCustomer = {
      id: 'cust-ff2eea08-ed31-440e-8411-75bf64d691be',
      reference_id: '69a2bab89b9e1c193978c114',
      type: 'BUSINESS',
      mobile_number: null,
      phone_number: null,
      individual_detail: null,
      business_detail: {
        business_name: 'Taskada',
        trading_name: null,
        business_type: null,
        nature_of_business: null,
        business_domicile: 'PH',
        date_of_registration: null,
      },
      identity_accounts: [],
      kyc_documents: [],
      addresses: [
        {
          country: 'PH',
          street_line1: '-',
          street_line2: null,
          city: null,
          province_state: null,
          postal_code: null,
          category: null,
          is_primary: true,
        },
      ],
      hashed_phone_number: null,
      created: '2026-02-28T09:52:59.225Z',
      updated: '2026-03-01T09:52:59.225Z',
      metadata: null,
      date_of_registration: null,
      description: null,
    };

    mockPost.mockResolvedValueOnce(partial_mockKyResponse({ status: 200, json: async () => updatedCustomer }));

    const result = await (await import('.')).update_customer(updateRequest);
    expect(result).toEqual(v.parse(CustomerSchema, updatedCustomer));
  });

  it('should throw with API error when update response is not ok', async () => {
    mockPost.mockResolvedValueOnce(
      partial_mockKyResponse({
        status: 400,
        json: async () => ({ error_code: 'INVALID_REQUEST', message: 'Bad request', errors: [] }),
      }),
    );

    const minimalUpdate = {
      individual_detail: {
        given_names: 'Task',
        surname: null,
        nationality: null,
        place_of_birth: null,
        date_of_birth: null,
        gender: null,
        employment: null,
      },
      business_detail: {
        business_name: 'Taskada',
        trading_name: null,
        business_type: null,
        nature_of_business: null,
        business_domicile: 'PH',
        date_of_registration: null,
      },
      mobile_number: null,
      phone_number: null,
      email: null,
      addresses: {
        country: 'PH',
        street_line1: '-',
        street_line2: null,
        city: null,
        province_state: null,
        postal_code: null,
        category: null,
        is_primary: true,
      },
      kyc_documents: [],
      description: null,
      date_of_registration: null,
      domicile_of_registration: 'PH',
      metadata: null,
    };

    await expect((await import('.')).update_customer(minimalUpdate)).rejects.toThrow(
      'Failed to update customer due to INVALID_REQUEST',
    );
  });
});
