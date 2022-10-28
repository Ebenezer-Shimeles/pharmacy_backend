import { Controller, Post,Body, Get, UseGuards, Request, Logger, BadRequestException, Patch } from '@nestjs/common';
import { ChangePasswordFromInsideInput, ChangePasswordFromOutsideInput, VerifyCompanyDto } from 'src/app.dto';
import { IsCompanyVerified } from 'src/company.strategy';
import { CompanyInputDTO, CompanyOutputDTO } from 'src/app.dto';
import { IsRetailerAuthenticated } from 'src/company.strategy';
import { RetailerService } from './retailer.service';

@Controller('retailers')
export class RetailerController {
    constructor(private retailerService: RetailerService){}
    @UseGuards(IsRetailerAuthenticated)
    @Get('me')
    async getRetailer(@Request() request){
        return request.user;
    }
   
    @Post()
    async createRetailer(@Body() company: CompanyInputDTO): Promise<null | CompanyOutputDTO>{
        const output = new CompanyOutputDTO();
        
        const provider = await this.retailerService.create(company);

        output.bankAccount = provider.bankAccount;
        output.createdAt = provider.createdAt;
        output.name = provider.name;
        output.tinNumber = provider.tinNumber;
        output.phoneNumber = provider.phoneNumber;

        return output;

   }
   @UseGuards(IsRetailerAuthenticated, IsCompanyVerified)
   @Get('test')
   async test(@Request() request){
       return request.user;
   }
   
   @UseGuards(IsRetailerAuthenticated, IsCompanyVerified,)
   @Patch('password') //this is to change the password from inside the app
   async changePasswordFromInsideTheApp(@Request() request, @Body() input: ChangePasswordFromInsideInput){
        if(!await this.retailerService.changePassword(request.user, input))
           throw new BadRequestException({ error: "Error old password does not match"})
       else return {msg: "Password changed"}
   }   
   
   @Post('password')
   async forgottenPassword(@Body() input: ChangePasswordFromOutsideInput){
       //This is used for outside the app
       // if there is a veification code and a new Password it acts to change the password
       // else it will send a verification code to the phone number
       if(!await this.retailerService.findByPhoneNumber(input.phoneNumber))
           throw new BadRequestException({error: 'Account does not exist'})     
       if(input.password && input.verificationCode && input.phoneNumber){
           if( await this.retailerService.changePasswordUsingCode(input)){
               return {msg: "Password changed"}
           }
           else{
               throw new BadRequestException({error: "Bad verification code given!"
               })
           }
       }
       else{
           const genResult =  await this.retailerService.generateVerificationCode(input.phoneNumber)
           if(genResult)
               return {msg: "Code Sent!"}
           throw new BadRequestException({error: "Error verification code already "})
       }
       
       
      

   }

   @UseGuards(IsRetailerAuthenticated)
   @Post('verification')
   async verify(@Request() request, @Body() input: VerifyCompanyDto){
        Logger.log({input}, 'Test')
        if(!await this.retailerService.verify(request.user, input))
           throw new BadRequestException({error: "Error wrong code given"})
       return {
           msg: "Verified!"
       }

   }
}
