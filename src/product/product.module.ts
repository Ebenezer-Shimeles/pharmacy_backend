import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {IsProviderAuthenticated} from 'src/company.strategy'
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ProviderService } from 'src/provider/provider.service';
@Module({
  providers: [ProductService, IsProviderAuthenticated, JwtService, ProviderService],
  controllers: [ProductController],
  imports: [JwtModule]
})
export class ProductModule {}
