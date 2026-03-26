import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { PaymentMethodController } from './payment_method.controller';
import { PaymentMethodService } from './payment_method.service';

@Module({
	imports: [DatabaseModule],
	controllers: [PaymentMethodController],
	providers: [PaymentMethodService],
	exports: [PaymentMethodService],
})
export class PaymentMethodModule {}
