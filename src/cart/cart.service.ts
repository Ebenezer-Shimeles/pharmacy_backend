import { Injectable, Logger } from '@nestjs/common';
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
        Logger.log({userId, entryId}, 'Test')
        const entry = await CartEntry.find({
           relations: ['retailer'],
            where: {
                
                id: entryId
            
            }, 
            
        
        });
        Logger.log(`Deleting ${JSON.stringify(entry)}`, 'Test');
       if(!entry[0] || entry[0].retailer.id !== userId) return false;

        Logger.log(`Deleting ${entry}`, 'Test')
        await CartEntry.remove(entry);
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
