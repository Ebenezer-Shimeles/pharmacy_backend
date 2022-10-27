import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [ProviderService, JwtService, ConfigService],
  controllers: [ProviderController,],
  imports: [JwtModule, ConfigModule]
})
export class ProviderModule {}
