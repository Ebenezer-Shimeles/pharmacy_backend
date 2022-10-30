import { Body, Controller, Get, Post, UseGuards, Request, Logger, Bind , Query, BadRequestException, Patch, Param, UseInterceptors, UploadedFile, Delete} from '@nestjs/common';
import { request } from 'http';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import {  ChangePasswordFromInsideInput, ChangePasswordFromOutsideInput,AddProductInputDTO, CompanyInputDTO, CompanyOutputDTO, VerifyCompanyDto, ChangeCompanyInfoDTO } from 'src/app.dto';
import { IsCompanyVerified, IsProviderAuthenticated } from 'src/company.strategy';


import { ProviderService } from './provider.service';
import { AuthGuard } from '@nestjs/passport';
import { Provider } from './provider.model';


@Controller('providers')
export class ProviderController {
    constructor(private providerService: ProviderService){}
     

    @UseGuards(AuthGuard('jwt'))
    @Post(":id/approval")
    async approveProvider(@Param('id') id:number){
        if(!Number.isInteger(id))
            throw new BadRequestException({error: "Error id is not valid"})
        if(!await this.providerService.verifyUser(id))
             throw new BadRequestException({error: "Use cannot be verified because it does not exist"})
        return {msg: 'verified'}
    }


    @UseGuards(AuthGuard('jwt'))
    @Delete(":id/approval")
    async removeProviderApprover(@Param('id') id:number){
        if(!Number.isInteger(id))
           throw new BadRequestException({error: "Error id is not valid"})
        if(!await this.providerService.removeUserVerification(id))
          throw new BadRequestException({error: "User does not exist"})
        return {msg: 'verification deleted'}
    }

    

    @UseGuards(IsProviderAuthenticated)
    @Get('me')
    async getProvider(@Request() request){
        return request.user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAllProviders(@Query() query){
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
        let providers = await Provider.createQueryBuilder()
                .select('*')
                
                .where('tin_number like :searchTerm or name like :searchTerm or bank_account like :searchTerm',
                   {searchTerm}
                )
                .limit(limit)
                .skip(limit*page)
                .getRawMany();
        providers = providers.map(provider => { delete provider.password; return provider})
        return providers

    }
      
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getProviderInfo(@Param('id') id:number){
        if(!Number.isInteger(id))
            throw new BadRequestException({error: "Error id is not valid"})
        const provider = await Provider.findOne({where:{id}, relations: ['products']})
        if(!provider) throw new BadRequestException({error: "Error provider unknown!"})
        delete provider.password
        return provider
    }

    @UseGuards(IsProviderAuthenticated, IsCompanyVerified)
    @Patch('me') //update account Info Except profilepicture and password
    async changeProfileInfo(@Request() request, @Body() input: ChangeCompanyInfoDTO){
         await this.providerService.changeInfo(request.user, input);
         return {msg: "Changed!"}
    }
    editFileName(){

    }
    @UseGuards(IsProviderAuthenticated)
    //  @UseInterceptors(FileInterceptor('file'))
      @Patch('me/picture')
      @UseInterceptors(FileInterceptor('file'))
     async changeProPic(@UploadedFile() file: Express.Multer.File, @Request() request) {
         if(!file) throw new BadRequestException({error: "No files found!"})
         console.log('upload')
         console.log(`Got File ${file.originalname} as ${file.filename}`, 'Test')
         const provider = await this.providerService.findByPhoneNumber(request.user.phoneNumber);
         provider.picLocation = file.filename;
         await provider.save();
         return {msg: "Profile Picture changed!"}
  
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

    @UseGuards(IsProviderAuthenticated, IsCompanyVerified)
    @Post('products')
    async addProduct(@Request() request,  @Body() input: AddProductInputDTO){
         const result = await this.providerService.addProductEntry( request?.user?.id, input);
         if(!result)
            throw new BadRequestException({error: "Bad date format given!"
            })
        return {
            msg: 'Added Product',
            data: result
        }
    }
   
    @UseGuards(IsProviderAuthenticated, IsCompanyVerified)
    @Get('products')
    async getProducts(@Request() req){
         return { data: await this.providerService.getProductEntriesof(req?.user?.id), msg: 'ok'}
    }

}
  