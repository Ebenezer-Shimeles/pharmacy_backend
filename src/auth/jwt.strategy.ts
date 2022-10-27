import {Strategy, ExtractJwt} from 'passport-jwt';

import {PassportStrategy} from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';


export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
       
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: false,
                secretOrKey: process.env.JWT_SECRET
            }
        )
    }
    validate(user){
        return {id: user.sub, email: user.email   }
    }
}