import { Controller, Post, Get, UseGuards , Request, Body, BadRequestException} from '@nestjs/common';
import { AddToCartInputDTO } from 'src/app.dto';
import { IsRetailerAuthenticated } from 'src/company.strategy';
import {CartService} from './cart.service';

@Controller('cart')
export class CartController {
    
    constructor(private cartService: CartService){}

    @UseGuards(IsRetailerAuthenticated)
    @Post('entries')
    async addToCart(@Request() request, @Body() input: AddToCartInputDTO){
       const result = await this.cartService.addItemToCart(request.user.id, input.productId);
       if(!result) throw new BadRequestException({error: "Either user id or product id is invalid"})
       return {msg: 'ok added to cart'}          
    }

    @UseGuards(IsRetailerAuthenticated)
    @Get('entries')
    async getEntries(@Request() request){
         return {data: await this.cartService.getEntriesOf(request.user.id), msg: 'ok'}
    }


}
