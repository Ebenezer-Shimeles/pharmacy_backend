import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { Category } from './product/category.model';
import { Product } from './product/product.model';
import { ProviderModule } from './provider/provider.module';
import { PromotionModule } from './promotion/promotion.module';
import { Promo } from './promotion/promotion.model';
import {ConfigModule} from '@nestjs/config';
import { RetailerModule } from './retailer/retailer.module';
import { AdminModule } from './admin/admin.module';

import { Provider } from './provider/provider.model';
import { Retailer } from './retailer/retailer.model';
import { ProductEntry } from './product/product.entry.model';
import { CartModule } from './cart/cart.module';
import { CartEntry } from './cart/cart.model';
import { AuthModule } from './auth/auth.module';
import { Admin } from './admin/admin.model';
import { RetailerTransaction } from './retailer/retailer.transaction.model';
import { Permission } from './admin/permission.models';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE  as 'mysql' | 'postgres' | 'mariadb',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Permission, Admin, Category, Product, Promo, Provider, Retailer, ProductEntry, CartEntry, RetailerTransaction],
      synchronize: true,
    }),
    ProductModule,
    ProviderModule,
    PromotionModule,
    RetailerModule,
    AuthModule,
    AdminModule,
    JwtModule.register({
      secretOrPrivateKey: process.env.JWT_SECRET,
      signOptions: {expiresIn: '600s'}
    }) ,
    CartModule,
    

    
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
