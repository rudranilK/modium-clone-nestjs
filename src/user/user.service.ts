import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import CreateUserDto from "./dto/createUser.dto";
import { UserEntity } from "./user.entity";
import { omit } from "lodash";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "@app/config";
import { UserResponseInterface } from "./types/userResponse.interface";
import loginUserDto from "./dto/loginUser.dto";
import { compare } from 'bcrypt';


@Injectable()
export class UserService{

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ){}

    async createUser(createUserDto: CreateUserDto): Promise<UserResponseInterface>{

        let user = await this.userRepository.findOne({
            where: [                                        // WHERE email = email OR username = username
                { email: createUserDto['email'] },
                { username: createUserDto['username']}
            ]
        });

        if(user) 
            throw new HttpException(
                `Username : '${createUserDto['username']}' OR Email: '${createUserDto['email']}' already taken!!`, 
                HttpStatus.UNPROCESSABLE_ENTITY);

    //creating a new user
        let newUser = new UserEntity();

    //ATM, this user is blank, we are adding the values for the columns
        Object.assign(newUser, createUserDto);

    //Saving the user
        newUser = await this.userRepository.save(newUser);

        return this.buildUserResponse(newUser);
    }

    async loginUser(loginUserDto: loginUserDto): Promise<UserResponseInterface>{
        const user = await this.userRepository.findOne({
            where: { email: loginUserDto['email'] }
        });

        if(!user) throw new HttpException(`Invalid Email Or Password`, HttpStatus.BAD_REQUEST);

        const validPassword = await compare(loginUserDto['password'], user.password);
        if(!validPassword) throw new HttpException(`Invalid Email Or Password`, HttpStatus.BAD_REQUEST);

        return this.buildUserResponse(user);
    }

    buildUserResponse(user: UserEntity): UserResponseInterface{
        return { 
            user: {
                ...omit( user, ['id', 'password'] ),
                token: this.generateJWT(user)           //add JWT to response body
            } 
        }
    }

    generateJWT(user: UserEntity): string{

        return sign(
            {
                id: user.id,
                username: user.username,
                email: user.email
            },
            JWT_SECRET          //For now stored in config.js but have to be stored in ENV variables
        );
    }
}

