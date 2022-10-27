import { Module } from '@nestjs/common';
import { AdminModule } from 'src/admin/admin.module';
import { AdminService } from 'src/admin/admin.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import {JwtModule} from '@nestjs/jwt'
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { ProviderModule } from 'src/provider/provider.module';
import { RetailerModule } from 'src/retailer/retailer.module';
import { ProviderService } from 'src/provider/provider.service';
import { RetailerService } from 'src/retailer/retailer.service';

@Module({
  providers: [AuthService, AdminService, LocalStrategy, JwtStrategy, ProviderService, RetailerService],
  exports: [AuthService],
  imports: 
  [
    ConfigModule,
     AdminModule,
    // ConfigModule.forFeature({}),
    JwtModule,
    //  JwtModule.register({
    //    secret: 'dsddds',
    //    signOptions: {expiresIn: '500s'}
    //  }),
     RetailerModule,
     ConfigModule,

     ProviderModule,
     
  ],
  controllers: [AuthController]
})
export class AuthModule {}
