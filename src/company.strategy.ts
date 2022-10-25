

import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Observable } from "rxjs";
import { ProviderService } from "./provider/provider.service";
import { RetailerService } from "./retailer/retailer.service";
@Injectable()
export class IsProviderAuthenticated  implements CanActivate{
    
    private type: string
    constructor( private  jwtService: JwtService, private providerService: ProviderService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorization: string = request.headers['authorization'];
        
        if(!authorization) return false;
        const token = authorization.split('Bearer').find(str => str.trim() != '')

        if(!token) return false;
        
        const obj: any = await this.jwtService.decode(token.trim())
        
        if(!obj || !obj.phoneNumber) return false;
        

        const user = await this.providerService.findByPhoneNumber(obj.phoneNumber)


       
        delete user.password
        request.user = user;
        return request;
    }
}



@Injectable()
export class IsRetailerAuthenticated  implements CanActivate{
    
    private type: string
    constructor( private  jwtService: JwtService, private retailerService: RetailerService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorization: string = request.headers['authorization'];
        
        if(!authorization) return false;
        const token = authorization.split('Bearer').find(str => str.trim() != '')

        if(!token) return false;
        
        const obj: any = await this.jwtService.decode(token.trim())
        
        if(!obj || !obj.phoneNumber) return false;
        

        const user = await this.retailerService.findByPhoneNumber(obj.phoneNumber)
        delete user.password
        request.user = user;
        return request;
    }
}