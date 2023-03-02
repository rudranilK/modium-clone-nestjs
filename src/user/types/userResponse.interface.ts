import { UserEntity } from "../user.entity"

type UserType = Omit<UserEntity, 'id' | 'password' | 'hashPassword'>;

export interface UserResponseInterface{
    user: UserType & { token: string; }
}