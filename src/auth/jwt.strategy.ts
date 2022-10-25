import {Strategy, ExtractJwt} from 'passport-jwt';

import {PassportStrategy} from '@nestjs/passport';


export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: false,
                secretOrKey: 'dsddds'
            }
        )
    }
    validate(user){
        return {id: user.sub, email: user.email   }
    }
}