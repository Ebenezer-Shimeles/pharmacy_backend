

import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { urlencoded } from "express";
import { Observable } from "rxjs";
import { ProviderService } from "./provider/provider.service";
import { RetailerService } from "./retailer/retailer.service";


@Injectable()
export class IsProviderAuthenticated  implements CanActivate{
    
    private type: string
    constructor( private  jwtService: JwtService, private providerService: ProviderService, private configService: ConfigService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorization: string = request.headers['authorization'];
        
        if(!authorization) return false;
    
        const token = authorization.split('Bearer').find(str => str.trim() != '')

        if(!token) return false;
        Logger.log(`Got token ${token}`)
        
        const secret = this.configService.get('JWT_SECRET_PROVIDER')
        try{
            if(!await this.jwtService.verify(token.trim(), {secret})) return false;
         }catch(e){
          return false;
        }

        const obj: any = await this.jwtService.decode(token.trim())
        
        if(!obj || !obj.phoneNumber) return false;
        

        const user = await this.providerService.findByPhoneNumber(obj.phoneNumber)
        if(!user) return false;
        delete user.password
        delete user.verificationCode
        request.user = user;
        Logger.log(request);
        return request;
    }
}



@Injectable()
export class IsRetailerAuthenticated  implements CanActivate{
    
    private type: string
    constructor( private  jwtService: JwtService, private retailerService: RetailerService,private  configService: ConfigService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorization: string = request.headers['authorization'];
        
        if(!authorization) return false;
        const token = authorization.split('Bearer').find(str => str.trim() != '')

        if(!token) return false;
        
        const secret = this.configService.get('JWT_SECRET_RETAILER')
        try{
              if(!await this.jwtService.verify(token.trim(), {secret})) return false;
        }catch(e){
            return false;
        }

        const obj: any = await this.jwtService.decode(token.trim())
        
        if(!obj || !obj.phoneNumber) return false;
      
        

        const user = await this.retailerService.findByPhoneNumber(obj.phoneNumber)
        if(!user ) return false;
        
        delete user.password
        delete user.verificationCode
        request.user = user;
        Logger.log(request);
        return request;
    }
}

@Injectable()
export class IsCompanyVerified implements CanActivate{
      canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
          const request = context.switchToHttp().getRequest()
           
          if(!request.user){ 
             Logger.log('user not found in request', 'IsCompanyVerified')
            return false;
          }

          if(!request.user.isVerified){
              Logger.log('user not verified', 'IsCompanyVerified')
              return false;
          }
          else return true;
      }
}

@Injectable()
export class IsCompanyAdminVerified implements CanActivate{
      canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
          const request = context.switchToHttp().getRequest()
           
          if(!request.user){ 
             Logger.log('user not found in request', 'IsCompanyVerified')
            return false;
          }

          if(!request.user.isVerifiedAdmin){
              Logger.log('user not verified', 'IsCompanyVerified')
              return false;
          }
          else return true;
      }
}