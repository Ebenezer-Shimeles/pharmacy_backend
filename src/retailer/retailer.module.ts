import { Module } from '@nestjs/common';
import { RetailerService } from './retailer.service';
import { RetailerController } from './retailer.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  providers: [RetailerService, JwtService],
  controllers: [RetailerController, ],
  imports: [JwtModule]
})
export class RetailerModule {}
