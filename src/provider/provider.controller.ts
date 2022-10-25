import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import {  CompanyInputDTO, CompanyOutputDTO } from 'src/app.dto';
import { IsProviderAuthenticated } from 'src/company.strategy';
import { ProviderService } from './provider.service';

@Controller('providers')
export class ProviderController {
    constructor(private providerService: ProviderService){}
    @UseGuards(IsProviderAuthenticated)
    @Get()
    async getProvider( request){
         return request.user;
    }
  
    @Post()
    async addProvider(@Body() company: CompanyInputDTO): Promise<null | CompanyOutputDTO>{
         const output = new CompanyOutputDTO();
         
         const provider = await this.providerService.create(company);

         output.bankAccount = provider.bankAccount;
         output.createdAt = provider.createdAt;
         output.name = provider.name;
         output.tinNumber = provider.tinNumber;
         output.phoneNumber = provider.phoneNumber;

         return output;

    }
}
