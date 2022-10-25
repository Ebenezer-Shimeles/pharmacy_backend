import { Controller, UseGuards,Bind, Request, Post, Get, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist';
import { Admin } from './admin.model';
import { AdminService } from './admin.service';
import { BadRequestException } from '@nestjs/common';
import { AdminInputDTO, AdminOutputDTO } from 'src/app.dto';

@Controller('admins')
export class AdminController {
     
        constructor(private adminService: AdminService){}
        @UseGuards(AuthGuard('jwt'))
        @Get('profile')
        async getProfile(@Request() req){
            return  req.user;
        }

        @Post()
        async createAdminAccount(@Body() body: AdminInputDTO) : Promise<AdminOutputDTO | null>{
              const admin =  await this.adminService.createAdmin(body.email, body.password, body.firstName, body.lastName);

              const {firstName, lastName, email, createdDate,} = admin;
              return {firstName, lastName, email, createdDate};
        }
}
