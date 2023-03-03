import { IsEmail, IsNotEmpty } from "class-validator";
import CreateUserDto from "./createUser.dto";

export default class loginUserDto {

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;
}