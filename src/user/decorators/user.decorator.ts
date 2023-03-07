import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import ExpressRequest from "@app/types/expressRequest.interface";

export const User = createParamDecorator(( data: any, ctx: ExecutionContext ) => {        //Function from nestjs to create a 'parameter decorator'
    
    const request = ctx.switchToHttp().getRequest<ExpressRequest>();  
    // const request = ctx.switchToHttp().getRequest();

    if(!request.user) return null;                                  // This decoratort is just to grab a specific field from the req.user. If we do not want a full user!

    if(data) return request.user[data];

    return request.user;
})