import { cancel_payment, cancel_payment_request, cancel_payout, cancel_session, capture_payment, create_customer, create_payout, create_session, get_customer, get_customer_list, get_payment_channels, get_payment_request_status, get_payment_status, get_payout, get_payout_by_reference_id, get_session_status, refund_payment, simulate_payment, update_customer } from '@repo/xendit-payment-engine';
import type { CancelPaymentRequest, CancelPaymentRequestRequest, CancelPaymentRequestResponse, CancelPaymentResponse, CancelPayoutRequest, CancelPayoutResponse, CancelSessionRequest, CancelSessionResponse, CapturePaymentRequest, CapturePaymentResponse, CreateCustomerRequest, CreateCustomerResponse, CreatePayoutRequest, CreatePayoutResponse, CreateRefundRequest, CreateRefundResponse, CreateSessionRequest, CreateSessionResponse, GetCustomerListRequest, GetCustomerListResponse, GetCustomerRequest, GetCustomerResponse, GetPaymentChannelsRequest, GetPaymentChannelsResponse, GetPaymentRequestStatusRequest, GetPaymentRequestStatusResponse, GetPaymentStatusRequest, GetPaymentStatusResponse, GetPayoutRequest, GetPayoutResponse, GetSessionStatusRequest, GetSessionStatusResponse, ListPayoutsRequest, ListPayoutsResponse, SimulatePaymentRequest, SimulatePaymentResponse, UpdateCustomerRequest, UpdateCustomerResponse } from '@repo/xendit-payment-engine';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PaymentEngineService {
  private readonly logger = new Logger(PaymentEngineService.name);

  async createSession(request: CreateSessionRequest): Promise<CreateSessionResponse> {
    this.logger.debug('createSession');
    return create_session(request);
  }

  async getSessionStatus(request: GetSessionStatusRequest): Promise<GetSessionStatusResponse> {
    this.logger.debug('getSessionStatus');
    return get_session_status(request);
  }

  async cancelSession(request: CancelSessionRequest): Promise<CancelSessionResponse> {
    this.logger.debug('cancelSession');
    return cancel_session(request);
  }

  async getPaymentStatus(request: GetPaymentStatusRequest): Promise<GetPaymentStatusResponse> {
    this.logger.debug('getPaymentStatus');
    return get_payment_status(request);
  }

  async capturePayment(request: CapturePaymentRequest): Promise<CapturePaymentResponse> {
    this.logger.debug('capturePayment');
    return capture_payment(request);
  }

  async cancelPayment(request: CancelPaymentRequest): Promise<CancelPaymentResponse> {
    this.logger.debug('cancelPayment');
    return cancel_payment(request);
  }

  async refundPayment(request: CreateRefundRequest): Promise<CreateRefundResponse> {
    this.logger.debug('refundPayment');
    return refund_payment(request);
  }

  async createPayout(request: CreatePayoutRequest): Promise<CreatePayoutResponse> {
    this.logger.debug('createPayout');
    return create_payout(request);
  }

  async cancelPayout(request: CancelPayoutRequest): Promise<CancelPayoutResponse> {
    this.logger.debug('cancelPayout');
    return cancel_payout(request);
  }

  async createCustomer(request: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    this.logger.debug('createCustomer');
    return create_customer(request);
  }

  async getCustomer(request: GetCustomerRequest): Promise<GetCustomerResponse> {
    this.logger.debug('getCustomer');
    return get_customer(request);
  }

  async getCustomerList(request: GetCustomerListRequest): Promise<GetCustomerListResponse> {
    this.logger.debug('getCustomerList');
    return get_customer_list(request);
  }

  async getPaymentChannels(request: GetPaymentChannelsRequest): Promise<GetPaymentChannelsResponse> {
    this.logger.debug('getPaymentChannels');
    return get_payment_channels(request);
  }

  async getPaymentRequestStatus(request: GetPaymentRequestStatusRequest): Promise<GetPaymentRequestStatusResponse> {
    this.logger.debug('getPaymentRequestStatus');
    return get_payment_request_status(request);
  }

  async cancelPaymentRequest(request: CancelPaymentRequestRequest): Promise<CancelPaymentRequestResponse> {
    this.logger.debug('cancelPaymentRequest');
    return cancel_payment_request(request);
  }

  async simulatePayment(request: SimulatePaymentRequest): Promise<SimulatePaymentResponse> {
    this.logger.debug('simulatePayment');
    return simulate_payment(request);
  }

  async getPayout(request: GetPayoutRequest): Promise<GetPayoutResponse> {
    this.logger.debug('getPayout');
    return get_payout(request);
  }

  async getPayoutByReferenceId(request: ListPayoutsRequest): Promise<ListPayoutsResponse> {
    this.logger.debug('getPayoutByReferenceId');
    return get_payout_by_reference_id(request);
  }

  async updateCustomer(request: UpdateCustomerRequest): Promise<UpdateCustomerResponse> {
    this.logger.debug('updateCustomer');
    return update_customer(request);
  }
}
