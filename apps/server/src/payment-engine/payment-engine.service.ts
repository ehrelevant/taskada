import {
  cancel_payment,
  cancel_session,
  capture_payment,
  create_payout,
  create_session,
  get_payment_status,
  get_session_status,
  refund_payment,
} from '@repo/xendit-payment-engine';
import { Injectable, Logger } from '@nestjs/common';
@Injectable()
export class PaymentEngineService {
  private readonly logger = new Logger(PaymentEngineService.name);

  async createSession(request: Record<string, unknown>): Promise<unknown> {
    this.logger.debug('createSession');
    return create_session(request as any);
  }

  async getSessionStatus(request: Record<string, unknown>): Promise<unknown> {
    this.logger.debug('getSessionStatus');
    return get_session_status(request as any);
  }

  async cancelSession(request: Record<string, unknown>): Promise<unknown> {
    this.logger.debug('cancelSession');
    return cancel_session(request as any);
  }

  async getPaymentStatus(request: Record<string, unknown>): Promise<unknown> {
    this.logger.debug('getPaymentStatus');
    return get_payment_status(request as any);
  }

  async capturePayment(request: Record<string, unknown>): Promise<unknown> {
    this.logger.debug('capturePayment');
    return capture_payment(request as any);
  }

  async cancelPayment(request: Record<string, unknown>): Promise<unknown> {
    this.logger.debug('cancelPayment');
    return cancel_payment(request as any);
  }

  async refundPayment(request: Record<string, unknown>): Promise<unknown> {
    this.logger.debug('refundPayment');
    return refund_payment(request as any);
  }

  async createPayout(request: Record<string, unknown>): Promise<unknown> {
    this.logger.debug('createPayout');
    return create_payout(request as any);
  }
}
