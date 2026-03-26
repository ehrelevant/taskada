import { Controller, Delete, Get, Param, Session } from '@nestjs/common';
import { UserSession } from '@thallesp/nestjs-better-auth';

import { PaymentMethodService } from './payment_method.service';

@Controller('payment-method')
export class PaymentMethodController {
	constructor(private readonly paymentMethodService: PaymentMethodService) {}

	@Get()
	async listPaymentMethods(@Session() { user: { id: userId } }: UserSession) {
		return await this.paymentMethodService.listPaymentMethods(userId);
	}

	@Delete(':id')
	async deletePaymentMethod(@Session() { user: { id: userId } }: UserSession, @Param('id') id: string) {
		return await this.paymentMethodService.deletePaymentMethod(userId, id);
	}
}
