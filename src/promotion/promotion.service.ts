import { Injectable } from '@nestjs/common';
import { Promo } from './promotion.model';

@Injectable()
export class PromotionService {

     
     async deletePromotion(id: number): Promise<boolean>{
        const promo = await Promo.findOneBy({id})
        if(!promo) return false;

        await promo.remove();
        return true;

     }
     async setPromotionPic(id: number, picLocation: string) : Promise<null | string>{
        const promo = await Promo.findOneBy({id})
        if(!promo) return null;
        promo.picUrl = picLocation;
       
        promo.save();
        return promo.picUrl;
     }
     async addPromotion(title: string, news: string){
        const promo = new Promo();
        promo.title = title;
        promo.news = news;

        await promo.save();
        return promo;
     }
}
