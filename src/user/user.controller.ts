import { Body, Controller, Post } from "@nestjs/common";
import CreateUserDto from "./dto/createUser.dto";
import { UserResponseInterface } from "./types/userResponse.interface";
import { UserService } from "./user.service";

@Controller('/api')
export class UserController{
    constructor(private readonly userService: UserService){}

    @Post('/users')
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface>{        
        return await this.userService.createUser(createUserDto);
    }
}