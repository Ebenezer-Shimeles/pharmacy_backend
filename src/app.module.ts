import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { Category } from './product/category.model';
import { Product } from './product/product.model';
import { CompanyModule } from './company/company.module';
import { PromotionModule } from './promotion/promotion.module';
import { Company } from './company/company.model';
import { Promo } from './promotion/promotion.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'muzebelahu',
      database: 'pharmacy',
      entities: [Category, Product, Company, Promo],
      synchronize: true,
    }),
    ProductModule,
    CompanyModule,
    PromotionModule,
    
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
