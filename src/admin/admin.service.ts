import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {generateVerficationCode} from 'src/utils';


import {Admin} from './admin.model';
import * as bc from 'bcrypt'
import { AdminForgottenPasswordDTO } from 'src/app.dto';
import { MessagingService } from 'src/messaging/messaging.service';

@Injectable()
export class AdminService {

    constructor(private msgService: MessagingService){}
    async sendForgottenPasswordCode(email){
        console.log('sending email')
        const admin = await this.getByEmail(email);
        await this.msgService.sendEmailTxt(admin.email, 'Forgotten Password', 
           `Hello, ${admin.verificationCode} is your verification code. Please do not give this code to other people`
        )
    }
    async getByEmail(email: string): Promise<Admin>{
         
        return await Admin.findOneBy({email});
    }
    async createAdmin(email: string, password: string, firstName: string, lastName: string): Promise<Admin>{
         if(await this.getByEmail(email)){
            throw new BadRequestException({error: "This email is taken please try another email"})
         }
         const salt = await bc.genSalt()

         const admin = new Admin();
         admin.email = email;
         admin.password = await bc.hash(password, salt);
         admin.firstName = firstName;
         admin.lastName = lastName
         
         await admin.save();

         return admin
    }
    async generateVerificationCode(email: string) : Promise<boolean>{
        Logger.log('Generating verfication', 'Test')
        const user: Admin = await this.getByEmail(email);
        if(user.verificationCode) return false;
        user.email = email;
        user.verificationCode = generateVerficationCode() + "";
       
        await user.save();
        await this.sendForgottenPasswordCode(user.email);
        Logger.log('code saved', 'Test')
        return true;
      }
      async changePasswordUsingCode(input: AdminForgottenPasswordDTO): Promise<boolean>{
            const user = await this.getByEmail(input.email);
            if(user.verificationCode != input.verificationCode) return false;
            const salt = await bc.genSalt();
            user.password = await bc.hash( input.password, salt);
            user.verificationCode = null;
            await user.save()
            return true
      }
}
