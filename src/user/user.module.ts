import { AuthGuard } from "@app/guards/auth.guard";
import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService, AuthGuard],
    exports: [UserService]                              //Have to export the service layer as it has the method 'getUserbyId()' which is used in Auth Middleware which is linked in the main 'app.module.ts'; without exporting it we can not use it in the middleware!
})
export class UserModule{

}