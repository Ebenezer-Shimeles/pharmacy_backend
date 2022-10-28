import { Module } from '@nestjs/common';
import { RetailerService } from './retailer.service';
import { RetailerController } from './retailer.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  providers: [RetailerService, JwtService, ConfigService],
  controllers: [RetailerController, ],
  imports: [JwtModule, ConfigModule, MulterModule.register({
    dest: './files',
  })]
})
export class RetailerModule {}
