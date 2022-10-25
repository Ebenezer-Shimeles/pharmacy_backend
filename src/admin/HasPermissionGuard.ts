
import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';


@Injectable()
export class HasPermissionGuard implements CanActivate{
    

    async canActivate(context: ExecutionContext): Promise<boolean>{
        return false;
    }
}