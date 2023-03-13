import { Body, Controller, Get, Post, Put, Req, UseGuards, UsePipes } from "@nestjs/common";
import CreateUserDto from "./dto/createUser.dto";
import loginUserDto from "./dto/loginUser.dto";
import { UserResponseInterface } from "./types/userResponse.interface";
import { UserService } from "./user.service";
import { User } from "./decorators/user.decorator";
import { UserEntity } from "./user.entity";
import { AuthGuard } from "@app/guards/auth.guard";
import UpdateUserDto from "./dto/updateUser.dto";
import { BackendValidationPipe } from "@app/shared/pipes/backendValidation.pipe";


@Controller('/api')
export class UserController{
    constructor(private readonly userService: UserService){}        //Dependency Injection

    @Post('/users')
    // @UsePipes(new ValidationPipe())         //Adding Validations for our DTO i.e. req payload
    @UsePipes(new BackendValidationPipe())          //Adding Validations for our DTO i.e. req payload
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface>{   //@Body('user') is grabbing req.body.body   
        return await this.userService.createUser(createUserDto);
    }

    @Post('/users/login')
    @UsePipes(new BackendValidationPipe())
    async loginUser(@Body('user') loginUserDto: loginUserDto): Promise<UserResponseInterface>{   //@Body('user') is grabbing req.body.body   
        return await this.userService.loginUser(loginUserDto);
    }

    @Get('/user')
    @UseGuards(AuthGuard)
    async getCurrentUser(@User() user: UserEntity): Promise<UserResponseInterface>{
        return this.userService.buildUserResponse(user);
    }

    @Put('/user')
    @UseGuards(AuthGuard)
    async updateUser(@Body('user') updateUserDto: UpdateUserDto, @User() user: UserEntity): Promise<UserResponseInterface>{
        return await this.userService.updateUser(updateUserDto, user);
    }
} 