import { UserEntity } from "@app/user/user.entity"

type Profiletype = Pick<UserEntity, 'username' | 'bio' | 'image'> & { following: boolean };

export default Profiletype ;