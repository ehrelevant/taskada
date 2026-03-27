import {
  cancel_payment,
  cancel_payment_request,
  cancel_payout,
  cancel_session,
  capture_payment,
  create_customer,
  create_payout,
  create_session,
  get_customer,
  get_customer_list,
  get_payment_channels,
  get_payment_request_status,
  get_payment_status,
  get_payment_token_status,
  get_payout,
  get_payout_by_reference_id,
  get_session_status,
  refund_payment,
  simulate_payment,
  update_customer,
} from '@repo/xendit-payment-engine';
import type {
  CancelPaymentRequest,
  CancelPaymentRequestRequest,
  CancelPaymentRequestResponse,
  CancelPaymentResponse,
  CancelPayoutRequest,
  CancelPayoutResponse,
  CancelSessionRequest,
  CancelSessionResponse,
  CapturePaymentRequest,
  CapturePaymentResponse,
  CreateCustomerRequest,
  CreateCustomerResponse,
  CreatePayoutRequest,
  CreatePayoutResponse,
  CreateRefundRequest,
  CreateRefundResponse,
  CreateSessionResponse,
  GetCustomerListResponse,
  GetCustomerResponse,
  GetPaymentChannelsRequest,
  GetPaymentChannelsResponse,
  GetPaymentRequestStatusRequest,
  GetPaymentRequestStatusResponse,
  GetPaymentStatusRequest,
  GetPaymentStatusResponse,
  GetPaymentTokenStatusRequest,
  GetPaymentTokenStatusResponse,
  GetPayoutRequest,
  GetPayoutResponse,
  GetSessionStatusRequest,
  GetSessionStatusResponse,
  ListPayoutsRequest,
  ListPayoutsResponse,
  SimulatePaymentRequest,
  SimulatePaymentResponse,
  UpdateCustomerRequest,
  UpdateCustomerResponse,
} from '@repo/xendit-payment-engine';
import { eq } from 'drizzle-orm';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  NewPaymentMethod,
  PaymentAuditLogType,
  paymentAuditLog,
  paymentMethod,
  UpdatePaymentAuditLog,
  user,
} from '@repo/database';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class PaymentEngineService {
  private readonly logger = new Logger(PaymentEngineService.name);

  constructor(private readonly dbService: DatabaseService) {}

  private async handleRequest<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let details: unknown = undefined;

      if (err?.response) {
        try {
          status = err.response.status ?? status;
          details = await err.response.json();
        } catch {
          details = { message: err.message };
        }
      } else if (typeof err?.statusCode === 'number') {
        status = err.statusCode;
        details = { message: err.message };
      } else if (typeof err?.status === 'number') {
        status = err.status;
        details = { message: err.message };
      } else {
        details = { message: err?.message ?? String(err) };
      }

      this.logger.error('External request failed', err);
      throw new HttpException({ error: details }, status);
    }
  }

  private async getPaymentMethodRow(user_id: string) {
    await this.dbService.db
      .select({
        userId: paymentMethod.userId,
        externalId: paymentMethod.externalId,
      })
      .from(paymentMethod)
      .where(eq(paymentMethod.userId, user_id))
      .limit(1);
  }

  private async createPaymentAuditLog(user_id: string, session_type: PaymentAuditLogType) {
    const [result] = await this.dbService.db
      .insert(paymentAuditLog)
      .values({
        userId: user_id,
        type: session_type,
      })
      .returning();
    return result;
  }

  private async updatePaymentAuditLog(id: string, updates: UpdatePaymentAuditLog) {
    const [result] = await this.dbService.db
      .update(paymentAuditLog)
      .set(updates)
      .where(eq(paymentAuditLog.id, id))
      .returning();
    return result;
  }

  async createSession(user_id: string): Promise<CreateSessionResponse> {
    this.logger.debug('createSession');
    const user_row = await this.dbService.getUser(user_id);


    let xenditCustomerId = user_row.xenditCustomerId;
    if (!xenditCustomerId) {
      const created = await this.createCustomer(user_id);
      xenditCustomerId = created.id;
    }

    const audit_log = await this.createPaymentAuditLog(user_id, 'SESSION_SAVE');
    const result: CreateSessionResponse = await this.handleRequest(() =>
      create_session({
        reference_id: audit_log.id,
        customer_id: xenditCustomerId,
        session_type: 'SAVE',
        amount: 0,
        currency: 'PHP',
        mode: 'PAYMENT_LINK',
        country: 'PH',
        success_return_url: 'https://example.com/xendit-success',
      }),
    );
    await this.updatePaymentAuditLog(audit_log.id, { externalId: result.payment_session_id });
    return result;
  }

  async getSessionStatus(request: GetSessionStatusRequest): Promise<GetSessionStatusResponse> {
    this.logger.debug('getSessionStatus');
    return this.handleRequest(() => get_session_status(request));
  }

  async getPaymentTokenStatus(request: GetPaymentTokenStatusRequest): Promise<GetPaymentTokenStatusResponse> {
    this.logger.debug('getPaymentTokenStatus');
    return this.handleRequest(() => get_payment_token_status(request));
  }

  async sessionSuccess(session_id: string) {
    this.logger.debug('sessionSuccess');
    const session_result = await this.getSessionStatus({ session_id });
    const payment_token_result = await this.getPaymentTokenStatus({
      payment_token_id: session_result.payment_token_id!,
    });
    const [user_row] = await this.dbService.db
      .select()
      .from(user)
      .where(eq(user.xenditCustomerId, session_result.customer_id))
      .limit(1);

    await this.dbService.db
      .insert(paymentMethod)
      .values({
        userId: user_row.id,
        type: 'TOKEN',
        channelCode: payment_token_result.channel_code,
        externalId: session_result.payment_token_id,
        status: payment_token_result.status,
        metadata: { ...payment_token_result.token_details, ...payment_token_result.channel_properties },
      } as NewPaymentMethod)
      .returning();
  }

  async cancelSession(request: CancelSessionRequest): Promise<CancelSessionResponse> {
    this.logger.debug('cancelSession');
    return this.handleRequest(() => cancel_session(request));
  }

  async getPaymentStatus(request: GetPaymentStatusRequest): Promise<GetPaymentStatusResponse> {
    this.logger.debug('getPaymentStatus');
    return this.handleRequest(() => get_payment_status(request));
  }

  async capturePayment(request: CapturePaymentRequest): Promise<CapturePaymentResponse> {
    this.logger.debug('capturePayment');
    return this.handleRequest(() => capture_payment(request));
  }

  async cancelPayment(request: CancelPaymentRequest): Promise<CancelPaymentResponse> {
    this.logger.debug('cancelPayment');
    return this.handleRequest(() => cancel_payment(request));
  }

  async refundPayment(request: CreateRefundRequest): Promise<CreateRefundResponse> {
    this.logger.debug('refundPayment');
    return this.handleRequest(() => refund_payment(request));
  }

  async createPayout(request: CreatePayoutRequest): Promise<CreatePayoutResponse> {
    this.logger.debug('createPayout');
    return this.handleRequest(() => create_payout(request));
  }

  async cancelPayout(request: CancelPayoutRequest): Promise<CancelPayoutResponse> {
    this.logger.debug('cancelPayout');
    return this.handleRequest(() => cancel_payout(request));
  }

  async createCustomer(user_id: string): Promise<CreateCustomerResponse> {
    this.logger.debug('createCustomer');
    const user_row = await this.dbService.getUser(user_id);
    const request: CreateCustomerRequest = {
      reference_id: user_row.id,
      date_of_registration: user_row.createdAt.toISOString(),
      email: user_row.email,
      type: 'INDIVIDUAL',
      mobile_number: user_row.phoneNumber,
      individual_detail: {
        given_names: user_row.firstName,
        surname: user_row.lastName,
      },
    };
    const result: CreateCustomerResponse = await this.handleRequest(() => create_customer(request));
    await this.dbService.db
      .update(user)
      .set({
        xenditCustomerId: result.id,
      })
      .where(eq(user.id, user_row.id))
      .returning();

    return result;
  }

  async getCustomer(user_id: string): Promise<GetCustomerResponse> {
    this.logger.debug('getCustomer');
    const user_row = await this.dbService.getUser(user_id);

    if (!user_row.xenditCustomerId) {
      this.logger.debug(`User ${user_row.id} has no xendit customer id. Fetching.`);
      const result2: GetCustomerListResponse = await this.handleRequest(() =>
        get_customer_list({ reference_id: user_row.id }),
      );
      const xenditCustomerId = result2.data[0].id;
      user_row.xenditCustomerId = xenditCustomerId;

      await this.dbService.updateUser(user_row.id, { xenditCustomerId: xenditCustomerId });
    }
    return this.handleRequest(() => get_customer({ customer_id: user_row.xenditCustomerId! }));
  }

  async getPaymentChannels(request: GetPaymentChannelsRequest): Promise<GetPaymentChannelsResponse> {
    this.logger.debug('getPaymentChannels');
    return this.handleRequest(() => get_payment_channels(request));
  }

  async getPaymentRequestStatus(request: GetPaymentRequestStatusRequest): Promise<GetPaymentRequestStatusResponse> {
    this.logger.debug('getPaymentRequestStatus');
    return this.handleRequest(() => get_payment_request_status(request));
  }

  async cancelPaymentRequest(request: CancelPaymentRequestRequest): Promise<CancelPaymentRequestResponse> {
    this.logger.debug('cancelPaymentRequest');
    return this.handleRequest(() => cancel_payment_request(request));
  }

  async simulatePayment(request: SimulatePaymentRequest): Promise<SimulatePaymentResponse> {
    this.logger.debug('simulatePayment');
    return this.handleRequest(() => simulate_payment(request));
  }

  async getPayout(request: GetPayoutRequest): Promise<GetPayoutResponse> {
    this.logger.debug('getPayout');
    return this.handleRequest(() => get_payout(request));
  }

  async getPayoutByReferenceId(request: ListPayoutsRequest): Promise<ListPayoutsResponse> {
    this.logger.debug('getPayoutByReferenceId');
    return this.handleRequest(() => get_payout_by_reference_id(request));
  }

  async updateCustomer(user_id: string, request: UpdateCustomerRequest): Promise<UpdateCustomerResponse> {
    this.logger.debug('updateCustomer');
    const user_row = await this.dbService.getUser(user_id);
    if (user_row.xenditCustomerId) {
      request.customer_id = await user_row.xenditCustomerId;
    } else {
      throw new Error(`User ${user_id} does not have a valid Xendit Customer Id. Please create one first.`);
    }

    return this.handleRequest(() => update_customer(request));
  }
}
