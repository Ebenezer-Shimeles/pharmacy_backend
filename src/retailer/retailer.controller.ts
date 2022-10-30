import { Controller, Post,Body, Get, UseGuards, Request, Logger, BadRequestException, Patch,UseInterceptors , UploadedFile,Delete, Query, Param} from '@nestjs/common';
import { ChangePasswordFromInsideInput, ChangePasswordFromOutsideInput, VerifyCompanyDto, ChangeCompanyInfoDTO } from 'src/app.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsCompanyVerified } from 'src/company.strategy';
import { CompanyInputDTO, CompanyOutputDTO } from 'src/app.dto';
import { IsRetailerAuthenticated } from 'src/company.strategy';
import { RetailerService } from './retailer.service';
import { AuthGuard } from '@nestjs/passport';
import { Retailer } from './retailer.model';

@Controller('retailers')
export class RetailerController {
    constructor(private retailerService: RetailerService){}
    @UseGuards(IsRetailerAuthenticated)
    @Get('me')
    async getRetailer(@Request() request){
        return request.user;
    }
    

    @UseGuards(AuthGuard('jwt'))
    @Post(":id/approval")
    async approveProvider(@Param('id') id:number){
        if(!Number.isInteger(id))
            throw new BadRequestException({error: "Error id is not valid"})
        if(!await this.retailerService.verifyUser(id))
             throw new BadRequestException({error: "Use cannot be verified because it does not exist"})
        return {msg: 'verified'}
    }


    @UseGuards(AuthGuard('jwt'))
    @Delete(":id/approval")
    async removeProviderApprover(@Param('id') id:number){
        if(!Number.isInteger(id))
           throw new BadRequestException({error: "Error id is not valid"})
        if(!await this.retailerService.removeUserVerification(id))
          throw new BadRequestException({error: "User does not exist"})
        return {msg: 'verification deleted'}
    }


    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getRetailerInfo(@Param('id') id: number){
        if(!Number.isInteger(id))
        throw new BadRequestException({error: "Error id is not valid"})
        const retailer = await Retailer.findOne({where:{id}, relations: ['transactions']})
        if(!retailer) throw new BadRequestException({error: "Error retailer unknown!"})
        delete retailer.password
        return retailer
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAllRetailers(@Query() query){
        let searchTerm = ''
        let limit = 10
        let page = 0
        if(query['searchTerm']) searchTerm = searchTerm 
        if(query['limit'])
            try{
                limit = Number.parseInt(query['limit'])
            }catch(e){
                throw new BadRequestException({error: "Bad number format given!"})
            }
        if(query['page'])
            try{
                page = Number.parseInt(query['page'])
            }catch(e){
                throw new BadRequestException({error: "Bad number format given!"})
            }
        if(searchTerm) searchTerm = `%${searchTerm}%`
        let retailers= await Retailer.createQueryBuilder()
                        .select('*')
                                
                        .where('tin_number like :searchTerm or name like :searchTerm or bank_account like :searchTerm',
                        {searchTerm}
                        )
                        .skip(limit*page)
                        .limit(limit)
                        
                        .getRawMany();
        retailers = retailers.map(provider => { delete provider.password; return provider})
        return retailers
    }


    @UseGuards(IsRetailerAuthenticated)
  //  @UseInterceptors(FileInterceptor('file'))
    @Post('me/picture')
    @UseInterceptors(FileInterceptor('file'))
   async changeProPic(@UploadedFile() file: Express.Multer.File, @Request() request) {
       if(!file) throw new BadRequestException({error: "No files found!"})
       
       const retailer = await this.retailerService.findByPhoneNumber(request.user.phoneNumber);
       retailer.picLocation = file.filename;
       retailer.save();
       return {msg: "Profile Picture changed!"}

    }

    @UseGuards(IsRetailerAuthenticated)
    @Patch('me') //update account Info Except profilepicture and password
    async changeProfileInfo(@Request() request, @Body() input: ChangeCompanyInfoDTO){
         await this.retailerService.changeInfo(request.user, input);
         return {msg: "Changed!"}
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
