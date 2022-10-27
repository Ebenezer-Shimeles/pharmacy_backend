import { Body, Injectable , Logger} from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import {CompanyAuthInputDTO} from 'src/app.dto';
import {JwtService} from '@nestjs/jwt';
import { RetailerService } from 'src/retailer/retailer.service';
import { ProviderService } from 'src/provider/provider.service';

import * as bc from 'bcrypt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
    

    constructor(private adminService: AdminService,
               private jwtService: JwtService,
               private retailerService: RetailerService,
               private providerService: ProviderService,
               private configService: ConfigService
        ){

    }
    async validate(email: string, password: string ){
        const admin = await this.adminService.getByEmail(email);
      //  console.log('validating...')
      Logger.log(JSON.stringify(admin), 'Admin=>')
       if(admin && admin.password == password) return admin;
       return admin;

    }

    async loginAdmin(user: any){
        const payload = {email: user.email, sub: user.id}
        const key = this.configService.get('JWT_SECRET')
       return { 
           access_token: this.jwtService.sign(payload, {secret: key})
        };
    }
    
    async loginProvider(input: CompanyAuthInputDTO){
        const provider = await this.providerService.findByPhoneNumber(input.phoneNumber);
        if(! provider || ! await bc.compare(input.password, provider.password)) 
            return null;
            const secret = this.configService.get('JWT_SECRET_PROVIDER')
        const phoneNumber = input.phoneNumber
        return {
            access_token: this.jwtService.sign({phoneNumber, sub: provider.id}, {secret})
        }
    }
    async loginRetailer( input: CompanyAuthInputDTO){
        const retailer = await this.retailerService.findByPhoneNumber(input.phoneNumber);
        

        if(! retailer || ! await bc.compare(input.password, retailer.password)) 
            return null;
        
        const phoneNumber = input.phoneNumber
        const secret = this.configService.get('JWT_SECRET_RETAILER')
        Logger.log({secret})
        return {
            access_token: this.jwtService.sign({phoneNumber, sub: retailer.id}, {secret})
        }
    }

}
