import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AddProductDTO } from 'src/app.dto';
import { IsProviderAuthenticated } from 'src/company.strategy';

@Controller('product')
export class ProductController {

    @UseGuards(IsProviderAuthenticated)
    @Post()
    async addProduct(@Request() request){
       return request.user
    }
}
