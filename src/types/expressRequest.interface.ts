import { UserEntity } from "@app/user/user.entity";
import { Request} from "express";

export default interface ExpressRequest extends Request{
    user?: UserEntity;
}