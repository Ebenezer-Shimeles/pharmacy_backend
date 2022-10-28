import { Controller, UseGuards,Bind, Request, Post, Get, Body, Patch, Query, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist';
import { Admin } from './admin.model';
import { AdminService } from './admin.service';
import { BadRequestException } from '@nestjs/common';
import { AdminForgottenPasswordDTO, AdminInputDTO, AdminOutputDTO } from 'src/app.dto';
import { TwilioService } from 'nestjs-twilio';
import { FileLogger } from 'typeorm';

@Controller('admins')
export class AdminController {
     
        constructor(private adminService: AdminService, ){}
        @UseGuards(AuthGuard('jwt'))
        @Get('me')
        async getProfile(@Request() req){
            
            return  req.user;
        }

        @Post('password')
        async forgottenPassword(@Body() input: AdminForgottenPasswordDTO,
                                @Query() query
        )
        {
                //This is used for outside the app
       // if there is a veification code and a new Password it acts to change the password
       // else it will send a verification code to the phone number
            if(!await this.adminService.getByEmail(input.email))
                throw new BadRequestException({error: 'Account does not exist'})     

            Logger.log(query, 'Test');
            if(input.password && input.verificationCode && input.email){
                if( await this.adminService.changePasswordUsingCode(input)){
                    return {msg: "Password changed"}
                }
                else{
                    throw new BadRequestException({error: "Bad verification code given!"
                    })
                }
            }
            else{
                const genResult =  await this.adminService.generateVerificationCode(input.email)
                if(genResult)
                    return {msg: "Code Sent!"}
                await this.adminService.sendForgottenPasswordCode(input.email)

                return {msg: "Verification code resent"}
            }
    
    
        }

        // @Patch('password')
        // async changePasswordFromInsise(){

        // }

        @Post()
        async createAdminAccount(@Body() body: AdminInputDTO) : Promise<AdminOutputDTO | null>{
              const admin =  await this.adminService.createAdmin(body.email, body.password, body.firstName, body.lastName);

              const {firstName, lastName, email, createdDate,} = admin;
            
              return {firstName, lastName, email, createdDate};
        }
        // @UseGuards(AuthGuard('jwt'))
        // @Patch('password')
        // async forgottenPassword(){

        // }


}
