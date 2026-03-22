import { Module } from '@nestjs/common';

import {
  CustomerController,
  PaymentController,
  PaymentRequestController,
  PayoutController,
  SessionController,
} from './controller';
import { PaymentEngineService } from './payment-engine.service';

@Module({
  controllers: [SessionController, PaymentController, PayoutController, CustomerController, PaymentRequestController],
  providers: [PaymentEngineService],
  exports: [PaymentEngineService],
})
export class PaymentEngineModule {}
