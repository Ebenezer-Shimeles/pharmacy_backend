import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import {Logger} from '@nestjs/common'

import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";


import { AuthService } from "./auth.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
     constructor(private authService: AuthService){
      super({usernameField: "email"});
     }
   

     async validate(email: string, password: string){
        Logger.log('called..')
        const user = await this.authService.validate(email, password);

        if(!user){
            Logger.log('user is null')
            throw new BadRequestException({error: 'Error! Error in password or email'})

        }
        return user
     }
}