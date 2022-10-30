import { Injectable } from '@nestjs/common';
import { Product } from './product.model';

@Injectable()
export class ProductService {

       constructor(){}
      
       async getProductById(id: number): Promise<Product>{
           return await Product.findOneBy({id})
       }
       async getProductByName(name: string): Promise<Product>{
            return await Product.findOneBy({name});
       }

       async getAllProductNames(){
           return (await Product.find()).map(product => product.name)
       }
       async addProductType(input){
           if(await this.getProductByName(input.name)) return false;
           const p = new Product()
           p.category = input.category
           p.name = input.name
           p.unitPrice = input.unitPrice
           await p.save()
           return true;
       }

}
