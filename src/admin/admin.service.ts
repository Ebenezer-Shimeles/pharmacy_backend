import { BadRequestException, Injectable } from '@nestjs/common';


import {Admin} from './admin.model';
import * as bc from 'bcrypt'

@Injectable()
export class AdminService {


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
}
