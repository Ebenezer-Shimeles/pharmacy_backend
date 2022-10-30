import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  providers: [PromotionService],
  controllers: [PromotionController],
  imports: [
    MulterModule.register({
         dest: './files'
    })
  ]
})
export class PromotionModule {}
