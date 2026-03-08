export interface PaymentMethod {
  id: string;
  userId: string;
  type: string;
  channelCode: string;
  externalId: string;
  status: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentMethodPayload {
  type: string;
  channelCode: string;
  externalId: string;
  metadata?: Record<string, unknown>;
}
