import { Controller, Delete, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('promotion')
export class PromotionController {
    @UseGuards(AuthGuard('jwt'))
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createPost(@UploadedFile() file: Express.Multer.File){
       
    }


    @UseGuards(AuthGuard('jwt'))
    @Delete()
    async deletePost(){
        
    }
}
