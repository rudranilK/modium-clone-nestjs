import { UserEntity } from "@app/user/user.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import ProfileResposeInterface from "./types/profileResponse.interface";
import { pick } from 'lodash';
import Profiletype from "./types/profile.type";
import { FollowEntity } from "./follow.entity";

@Injectable()
export class ProfileService{

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FollowEntity)
        private readonly followRepository: Repository<FollowEntity> 
    ){}

    async getProfile(userId: number, username : string): Promise<ProfileResposeInterface>{

        const user = await this.userRepository.findOne({
            where: { username }
        });

        if(!user) throw new HttpException('Profile Does Not Exist!!', HttpStatus.NOT_FOUND);

        let followStatus: boolean = false;

        //If user is logged-in, check if the current user is following the profile requested with 'username'
        if(userId){
            const following = await this.followRepository.findOne({
                where: { 
                    followerId: userId,
                    followingId: user.id
                }
            });

            followStatus = following?true: false;
        }
    
        return this.buildProfileResponse({ ...user, following: followStatus });
    }

    async followProfile( userId: number, username : string): Promise<ProfileResposeInterface>{

        const followedUser = await this.userRepository.findOne({
            where: { username }
        });

    //username doesn't exist
        if(!followedUser) throw new HttpException('Profile Does Not Exist!!', HttpStatus.NOT_FOUND);

    //You can not follow yourself
        if(userId === followedUser.id) throw new HttpException("Follower & Following Can't Be Same!!", HttpStatus.BAD_REQUEST);

    //Follower is already following the username - don't throw error - return the profile
        const recordExists = await this.followRepository.findOne({
            where: { 
                followerId: userId,
                followingId: followedUser.id
            }
        });

        //If previously not followed - create a follow record
        if(!recordExists){

            //Insert a record in our manually created relation table
                const followRecord = new FollowEntity();
                followRecord.followerId = userId;
                followRecord.followingId = followedUser.id;
       
                await this.followRepository.save(followRecord);
        }

        return this.buildProfileResponse({ ...followedUser, following: true });
    }

    async unfollowProfile( userId: number, username : string): Promise<ProfileResposeInterface>{
        return 'returns profile' as any;
    }

    buildProfileResponse(userProfile: Profiletype){
        return {
            profile: pick(userProfile, ['username', 'bio', 'image', 'following'])
        }
    }
    
}