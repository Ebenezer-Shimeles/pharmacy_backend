import { Controller, Post, Get, UseGuards , Request, Body, BadRequestException, Delete, Param, HttpStatus, HttpCode} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddToCartInputDTO } from 'src/app.dto';
import { IsRetailerAuthenticated } from 'src/company.strategy';
import Api from 'twilio/lib/rest/Api';
import {CartService} from './cart.service';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiTags('Cart')
@Controller('cart')
export class CartController {
    
    constructor(private cartService: CartService){}

    @ApiBearerAuth('retailer')
    @UseGuards(IsRetailerAuthenticated)
    @HttpCode(200)
    @Post('entries')
    async addToCart(@Request() request, @Body() input: AddToCartInputDTO){
       const result = await this.cartService.addItemToCart(request.user.id, input.productId);
       if(!result) throw new BadRequestException({error: "Either user id or product id is invalid"})
       return {msg: 'ok added to cart'}          
    }

    @ApiBearerAuth('retailer')
    @UseGuards(IsRetailerAuthenticated)
    @Get('entries')
    async getEntries(@Request() request){
         return {data: await this.cartService.getEntriesOf(request.user.id), msg: 'ok'}
    }

    @ApiOperation({summary: "The id is entry in cart id"})
    @ApiBearerAuth('retailer')
    @UseGuards(IsRetailerAuthenticated)
    @Delete(':entryId')
    async removeFromCart(@Request() req, @Param('entryId') entryId: number){
        if(!await this.cartService.removeFromCart(req.user.id,entryId ))
            throw new BadRequestException({error: "Cannot delete!"})
        return {msg: " removed from cart"}
    } 

}
