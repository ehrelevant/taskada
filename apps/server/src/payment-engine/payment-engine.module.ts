import { Module } from '@nestjs/common';

import { PaymentEngineService } from './payment-engine.service';

@Module({
  providers: [PaymentEngineService],
  exports: [PaymentEngineService],
})
export class PaymentEngineModule {}
