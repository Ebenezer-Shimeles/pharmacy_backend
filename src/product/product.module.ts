import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {IsProviderAuthenticated} from 'src/company.strategy'
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ProviderService } from 'src/provider/provider.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagingModule } from 'src/messaging/messaging.module';
import { MessagingService } from 'src/messaging/messaging.service';
@Module({
  providers: [ProductService, IsProviderAuthenticated, JwtService, ProviderService, ConfigService, MessagingService],
  controllers: [ProductController],
  imports: [JwtModule, ConfigModule, MessagingModule]
})
export class ProductModule {}
