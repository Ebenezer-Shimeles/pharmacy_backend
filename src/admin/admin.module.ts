import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { MessagingModule } from 'src/messaging/messaging.module';
import { MessagingService } from 'src/messaging/messaging.service';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  providers: [AdminService, MessagingService, ConfigService],
  controllers: [AdminController],
  imports: [MessagingModule, ConfigModule]
  //imports: [AuthModule, ]
})
export class AdminModule {}
