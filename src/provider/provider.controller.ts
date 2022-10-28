import { Body, Controller, Get, Post, UseGuards, Request, Logger, Bind , BadRequestException, Patch} from '@nestjs/common';
import {  ChangePasswordFromInsideInput, ChangePasswordFromOutsideInput, CompanyInputDTO, CompanyOutputDTO, VerifyCompanyDto } from 'src/app.dto';
import { IsCompanyVerified, IsProviderAuthenticated } from 'src/company.strategy';
import { Query } from 'typeorm/driver/Query';

import { ProviderService } from './provider.service';

@Controller('providers')
export class ProviderController {
    constructor(private providerService: ProviderService){}


    @UseGuards(IsProviderAuthenticated)
    @Get('me')
    async getProvider(@Request() request){
        return request.user;
    }
    @Post()
    async addProvider(@Body() company: CompanyInputDTO): Promise<null | CompanyOutputDTO>{
         const output = new CompanyOutputDTO();
         
         const provider = await this.providerService.create(company);
         if(!provider ) throw new BadRequestException({error: "Something went wrong"})
         output.bankAccount = provider.bankAccount;
         output.createdAt = provider.createdAt;
         output.name = provider.name;
         output.tinNumber = provider.tinNumber;
         output.phoneNumber = provider.phoneNumber;
         
         return output;

    }

    @UseGuards(IsProviderAuthenticated, IsCompanyVerified)
    @Get('test')
    async test(@Request() request){
        return request.user;
    }
    
    @UseGuards(IsProviderAuthenticated, IsCompanyVerified,)
    @Patch('password') //this is to change the password from inside the app
    async changePasswordFromInsideTheApp(@Request() request, @Body() input: ChangePasswordFromInsideInput){
         if(!await this.providerService.changePassword(request.user, input))
            throw new BadRequestException({ error: "Error old password does not match"})
        else return {msg: "Password changed"}
    }   
    
    @Post('password')
    async forgottenPassword(@Body() input: ChangePasswordFromOutsideInput){
        //This is used for outside the app
        // if there is a veification code and a new Password it acts to change the password
        // else it will send a verification code to the phone number
        if(!await this.providerService.findByPhoneNumber(input.phoneNumber))
             throw new BadRequestException({error: 'Account does not exist'})     

        if(input.password && input.verificationCode && input.phoneNumber){
            if( await this.providerService.changePasswordUsingCode(input)){
                return {msg: "Password changed"}
            }
            else{
                throw new BadRequestException({error: "Bad verification code given!"
                })
            }
        }
        else{
            const genResult =  await this.providerService.generateVerificationCode(input.phoneNumber)
            if(genResult)
                return {msg: "Code Sent!"}
            throw new BadRequestException({error: "Error verification code already "})
        }
        
        
        throw new BadRequestException({error: "Bad Request"})

    }

    @UseGuards(IsProviderAuthenticated)
    @Post('verification')
    async verify(@Request() request, @Body() input: VerifyCompanyDto){
         Logger.log({input}, 'Test')
         if(!await this.providerService.verify(request.user, input))
            throw new BadRequestException({error: "Error wrong code given"})
        return {
            msg: "Verified!"
        }

    }
}
