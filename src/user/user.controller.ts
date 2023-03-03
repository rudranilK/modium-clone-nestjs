import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import CreateUserDto from "./dto/createUser.dto";
import loginUserDto from "./dto/loginUser.dto";
import { UserResponseInterface } from "./types/userResponse.interface";
import { UserService } from "./user.service";
import { Request } from "express";

@Controller('/api')
export class UserController{
    constructor(private readonly userService: UserService){}

    @Post('/users')
    @UsePipes(new ValidationPipe())         //Adding Validations for our DTO i.e. req payload
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface>{   //@Body('user') is grabbing req.body.body   
        return await this.userService.createUser(createUserDto);
    }

    @Post('/users/login')
    @UsePipes(new ValidationPipe())         //Adding Validations for our DTO i.e. req payload
    async loginUser(@Body('user') loginUserDto: loginUserDto): Promise<UserResponseInterface>{   //@Body('user') is grabbing req.body.body   
        return await this.userService.loginUser(loginUserDto);
    }

    @Get('/user')
    async getCurrentUser(@Req() req: Request): Promise<any>{
        return 'current user' as any;
    }
} 