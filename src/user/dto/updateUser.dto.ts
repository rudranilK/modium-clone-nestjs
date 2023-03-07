import { Optional } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export default class UpdateUserDto{

    readonly username: string;

    readonly email: string;

    readonly bio: string;

    readonly image: string;
}