import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RetailerService } from 'src/retailer/retailer.service';
import { RetailerModule } from 'src/retailer/retailer.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [CartService, JwtService, RetailerService, ConfigService],
  imports: [JwtModule, RetailerModule, ConfigModule],
  controllers: [CartController, ]
})
export class CartModule {}
