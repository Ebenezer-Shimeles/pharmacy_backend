import { Module } from '@nestjs/common';
import { RetailerService } from './retailer.service';
import { RetailerController } from './retailer.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [RetailerService, JwtService, ConfigService],
  controllers: [RetailerController, ],
  imports: [JwtModule, ConfigModule]
})
export class RetailerModule {}
