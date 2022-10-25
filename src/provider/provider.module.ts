import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  providers: [ProviderService, JwtService],
  controllers: [ProviderController,],
  imports: [JwtModule]
})
export class ProviderModule {}
