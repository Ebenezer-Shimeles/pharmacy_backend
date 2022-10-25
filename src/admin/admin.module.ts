import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  //imports: [AuthModule, ]
})
export class AdminModule {}
