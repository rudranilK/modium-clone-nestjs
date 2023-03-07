import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import ExpressRequest from "@app/types/expressRequest.interface"

@Injectable()
export class AuthGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean {

        const req = context.switchToHttp().getRequest<ExpressRequest>();     
        // const req = context.switchToHttp().getRequest();                    // Since We used 'req: ExpressRequest' in middleware, we modified the default 'Request' with 'ExpressRequest'

        if(req.user) return true;

        throw new HttpException('Not Authorized!!', HttpStatus.UNAUTHORIZED);
    }
}