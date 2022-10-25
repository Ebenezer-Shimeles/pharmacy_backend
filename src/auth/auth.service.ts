import { Body, Injectable } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import {CompanyAuthInputDTO} from 'src/app.dto';
import {JwtService} from '@nestjs/jwt';
import { RetailerService } from 'src/retailer/retailer.service';
import { ProviderService } from 'src/provider/provider.service';

import * as bc from 'bcrypt';
@Injectable()
export class AuthService {
    

    constructor(private adminService: AdminService,
               private jwtService: JwtService,
               private retailerService: RetailerService,
               private providerService: ProviderService
        ){

    }
    async validate(email: string, password: string ){
        const admin = await this.adminService.getByEmail(email);
      //  console.log('validating...')
       if(admin && admin.password == password) return admin;
       return null;

    }

    async loginAdmin(user: any){
        const payload = {email: user.email, sub: user.id}
       return { 
           access_token: this.jwtService.sign(payload)
        };
    }
    
    async loginProvider(input: CompanyAuthInputDTO){
        const provider = await this.providerService.findByPhoneNumber(input.phoneNumber);
        if(! provider || ! await bc.compare(input.password, provider.password)) 
            return null;
        const phoneNumber = input.phoneNumber
        return {
            access_token: this.jwtService.sign({phoneNumber, sub: provider.id})
        }
    }
    async loginRetailer( input: CompanyAuthInputDTO){
        const retailer = await this.retailerService.findByPhoneNumber(input.phoneNumber);
        if(! retailer || ! await bc.compare(input.password, retailer.password)) 
            return null;
        
        const phoneNumber = input.phoneNumber
        return {
            access_token: this.jwtService.sign({phoneNumber, sub: retailer.id})
        }
    }

}
