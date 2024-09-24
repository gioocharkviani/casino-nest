import { Module } from '@nestjs/common';
import { NotifiGatewey } from './notifi.gatewey';

@Module({
  providers: [NotifiGatewey],
  exports: [NotifiGatewey]
})
export class NotifiModule {}
