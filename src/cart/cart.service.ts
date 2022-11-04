import { Injectable } from '@nestjs/common';
import { ProductEntry } from 'src/product/product.entry.model';
import { Product } from 'src/product/product.model';
import { Retailer } from 'src/retailer/retailer.model';
import { CartEntry } from './cart.model';

@Injectable()
export class CartService {

    async addItemToCart(userId: number, productId: number): Promise<boolean>{
       const retailer = await Retailer.findOneBy({id: userId})
       if(!retailer) return false;
       const product  = await ProductEntry.findOneBy({id: productId});
       if(!product) return false;
       const entry = new CartEntry()
       entry.product = product;
       entry.retailer = retailer;
       await entry.save();
       return true;

    }
    async removeFromCart(userId: number, entryId: number){
        const entry = await CartEntry.findBy(
            {
                id: entryId,
                retailer:{
                    id: userId
                }
            }
        );
        if(!entry) return false;
        return true;
    }
      

    async getEntriesOf(userId: number){
         
       return await  CartEntry.find({
         relations: ['product'],
          where:{

            retailer: {
                id: userId
            }
        }},)
    }
}
