import { HttpException, HttpStatus, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import {JWT_SECRET} from "@app/config";
import { verify } from "jsonwebtoken";

export class AuthMiddleware implements NestMiddleware{                  // middleware added in req processing pipeline in 'app.module.ts'
    async use(req: Request, res: Response, next: NextFunction) {

        const token = req.header('Authorization')?.split(' ')?.[1];
        if(!token)
            throw new HttpException('Access Denied! No token provided.', HttpStatus.BAD_REQUEST);

        try {
            const decoded = verify(token, JWT_SECRET);
            // req.user = decoded;
            console.log(decoded);
            next();                             //Call goes to controller layer/next middleware
        } catch (e) {
            throw new HttpException('Invalid Token!!', HttpStatus.BAD_REQUEST);
        }
    }
}