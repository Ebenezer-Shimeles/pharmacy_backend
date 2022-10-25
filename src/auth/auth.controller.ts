import { Controller, UseGuards, Post, Bind, Request, Body, BadRequestException } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport'
import { Logger } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CompanyAuthInputDTO } from 'src/app.dto';
@Controller('auth')
export class AuthController {
    
    constructor(private authService: AuthService){

    }
    @UseGuards(AuthGuard('local'))
    @Post('admin')
    @Bind(Request())
    async loginAdmin(request){
      // Logger.warn('here')
       return this.authService.loginAdmin(request.user);
    }
   
    @Post('retailer')
    async loginRetailer(@Body()  input: CompanyAuthInputDTO){
        const response =  await this.authService.loginRetailer(input)
        if(!response) throw new BadRequestException({error: "Error in password or phone number"})
        return response;
    }

    @Post('provider')
    async loginProvider(@Body()  input: CompanyAuthInputDTO){
        const response =  await this.authService.loginProvider(input)
        if(!response) throw new BadRequestException({error: "Error in password or phone number"})
        return response;
    }

    @Post('test')
    async test(){
        Logger.log('hi')
        return "test"
    }
}
