import { Controller, Post,Body, Get, UseGuards, Request } from '@nestjs/common';
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
}
