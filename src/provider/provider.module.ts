import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagingModule } from 'src/messaging/messaging.module';
import { MessagingService } from 'src/messaging/messaging.service';


@Module({
  providers: [ProviderService, JwtService, ConfigService, MessagingService],
  controllers: [ProviderController,],
  imports: [JwtModule, ConfigModule, MessagingModule]
})
export class ProviderModule {}
