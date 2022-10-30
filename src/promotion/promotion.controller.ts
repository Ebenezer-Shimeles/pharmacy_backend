import { Controller, Delete, Post, UploadedFile, UseGuards, UseInterceptors, Request, BadRequestException, HttpCode, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddPromoInputDTO } from 'src/app.dto';
import { PromotionService } from './promotion.service';

@Controller('promotion')
export class PromotionController {

    constructor(private promoService: PromotionService){}

    @UseGuards(AuthGuard('jwt'))
    @Post(':id/picture')
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('file'))
    async addPic(@UploadedFile() file: Express.Multer.File, @Param('id') id: number){
       if(!file) throw new BadRequestException({error: "error `file` expected"})
       
       if(!Number.isInteger(id))
             throw new BadRequestException({error: "Error file id is not valid!"})
       const result = await this.promoService.setPromotionPic(id, file.filename);
       if(result) return {msg: 'ok changed!'}
       throw new BadRequestException({error: "Error this id does not exist or invalid file given"})

    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async addPost(@Request() request, input: AddPromoInputDTO){
        return {data: await this.promoService.addPromotion(input.title, input.msg), msg: 'ok'}
    }


    @UseGuards(AuthGuard('jwt'))
    @Delete(":id")
    async deletePost(@Param('id') id:number){
        if(!Number.isInteger(id))
             throw new BadRequestException({error: "Error file id is not valid!"})
        const result = await this.promoService.deletePromotion(id);
        if(result) return {msg:'Deleted'}
        throw new BadRequestException({error: "cannot delete or id does not exist"})
    }
}
