import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { desc, eq, and } from 'drizzle-orm';
import { paymentMethod } from '@repo/database';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class PaymentMethodService {
	constructor(private readonly dbService: DatabaseService) {}

	async listPaymentMethods(userId: string) {
		const results = await this.dbService.db
			.select({
				id: paymentMethod.id,
				userId: paymentMethod.userId,
				type: paymentMethod.type,
				channelCode: paymentMethod.channelCode,
				externalId: paymentMethod.externalId,
				status: paymentMethod.status,
				metadata: paymentMethod.metadata,
				createdAt: paymentMethod.createdAt,
				updatedAt: paymentMethod.updatedAt,
			})
			.from(paymentMethod)
			.where(eq(paymentMethod.userId, userId))
			.orderBy(desc(paymentMethod.createdAt));

		return results;
	}

	async deletePaymentMethod(userId: string, id: string) {
		try {
			const [deleted] = await this.dbService.db
				.delete(paymentMethod)
				.where(and(eq(paymentMethod.id, id), eq(paymentMethod.userId, userId)))
				.returning();

			if (!deleted) {
				throw new NotFoundException(`Payment method with ID ${id} not found`);
			}

			return deleted;
		} catch (error) {
			throw new BadRequestException(`Failed to delete payment method: ${(error as Error).message}`);
		}
	}
}
