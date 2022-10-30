import { Controller, Post, UseGuards, Request, Body, Get , BadRequestException, Query, Param} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { query } from 'express';
import { get } from 'http';
import { of } from 'rxjs';
import { AddProductDTO, AddProductNameDTO } from 'src/app.dto';
import { IsCompanyVerified, IsProviderAuthenticated } from 'src/company.strategy';
import {  } from 'typeorm/driver/Query';
import { ProductEntry } from './product.entry.model';
import { Product } from './product.model';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {

    constructor(private productService: ProductService){}
  
   // @UseGuards(IsProviderAuthenticated, IsCompanyVerified)
    
   
    
    @Get('names')
    async getProductNames(){
        return { data: await this.productService.getAllProductNames(), msg: "ok"};
    }


    @Get()
    async getProducts(@Query() query)
    {
        //This gets all products
        let limit = 10;
        let searchTerm = ''
        if(query['searchTerm']) searchTerm = query['searchTerm'];
        if(query['limit']) limit = Number(query['limit'])
        searchTerm = `%${searchTerm}%`;

        const productLikes = Product.createQueryBuilder()
                             .select('*')
                             .where('name like :searchTerm or category like :searchTerm', {searchTerm})
                             .limit(limit)
                             .orderBy('added_at');
        

        return {data: productLikes.getRawMany(), msg: 'ok'};

    }
    @Get('entries/:id')
    async getEntryInfo(
        @Param('id') id: number
    ){
        if(!Number.isInteger(id))
            throw new BadRequestException({error: "Id parameter must be a number"})
        const entry = await ProductEntry.findOneBy({id})

        return {data: entry, msg: 'ok'}
    }

    @Get(':id/entries')
    async getProductEntries(
        @Param('id') id: number,
        @Query() query
    ){
        let searchTerm = '';
        let limit = 10;
        

        if(query['limit']) limit = Number(query['limit']);
        if(query['searchTerm']) searchTerm = query['searchTerm'];
        searchTerm = `%${searchTerm}%`
        
        if(!Number.isInteger(id))
            throw new BadRequestException({error: "Id parameter must be a number"})
      
        const product = await Product.findOneBy({id})
        if(!product) 
            throw new BadRequestException({error: "Product not found!"})
        let entries = ProductEntry.createQueryBuilder()
                    .select('*')
                    .where('for_product = :id and (remark like :searchTerm or batch_number like :searchTerm) ', {id, searchTerm})
                    .limit(limit)
                    .orderBy('added_at')

        return {data: entries.getRawMany(), msg: 'ok' };

    }
    
    @Get(':id')
    async getProductInfo(
        @Param('id') id: number
    ){
       if(!Number.isInteger(id)) 
           throw new BadRequestException({error: "Id must be a number"});

        const product = await Product.findOneBy({id})

        return {data: product, msg: 'ok'}
    }


    @UseGuards(AuthGuard('jwt'))
    @Post() //This is to add a new product type
    async addProductType(@Body() input: AddProductNameDTO){
         if(!await this.productService.addProductType(input)) 
            throw new BadRequestException({error: "Error the name is taken"})
        
         return  {msg: "Ok new Product added"}
    }
    

}
