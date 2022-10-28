import { Controller, Post, UseGuards, Request, Body, Get , BadRequestException} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { get } from 'http';
import { AddProductDTO, AddProductNameDTO } from 'src/app.dto';
import { IsCompanyVerified, IsProviderAuthenticated } from 'src/company.strategy';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {

    constructor(private productService: ProductService){}
  
   // @UseGuards(IsProviderAuthenticated, IsCompanyVerified)
    
   
    
    @Get('names')
    async getProductNames(){
        return { data: await this.productService.getAllProductNames(), msg: "ok"};
    }

    @UseGuards(AuthGuard('jwt'))
    @Post() //This is to add a new product type
    async addProductType(@Body() input: AddProductNameDTO){
         if(!await this.productService.addProductType(input)) 
            throw new BadRequestException({error: "Error the name is taken"})
         return  {msg: "Ok new Product added"}
    }
    

}
