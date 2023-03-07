import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import {JWT_SECRET} from "@app/config";
import { verify } from "jsonwebtoken";
import ExpressRequest from "@app/types/expressRequest.interface";
import { UserService } from "@app/user/user.service";

@Injectable()                                                       //Since we are using UserService we have to inject the USerService class through the constructor and we have to decorate the middleware with 'Injectable()' as well!! WRITE INJECTABLE FOR YOUR MIDDLEWARES & SERVICES!!!
export class AuthMiddleware implements NestMiddleware{                   // middleware added in req processing pipeline in 'app.module.ts'

    constructor(private readonly userService: UserService){}             //Injecting the sertvice layer

    async use(req: ExpressRequest, _: Response, next: NextFunction) {       //repaced var name 'res' with '_' as it is unused

        const token = req.header('Authorization')?.split(' ')?.[1];         // Header Format -> Authorization : 'Token <jwt.token.here>'
        if(!token || token === undefined){
            // throw new HttpException('Access Denied! No token provided.', HttpStatus.BAD_REQUEST);
            req.user = null;
            next();
            return;
        }

        try {
            const decoded = verify(token, JWT_SECRET);
            req.user = await this.userService.findUserById(decoded['id']);
            next();                                                         //Call goes to controller layer/next middleware
        } catch (e) {
            // throw new HttpException('Invalid Token!!', HttpStatus.BAD_REQUEST);
            req.user = null;
            next();
        }
    }
}