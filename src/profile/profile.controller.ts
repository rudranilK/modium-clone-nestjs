import { AuthGuard } from "@app/guards/auth.guard";
import { User } from "@app/user/decorators/user.decorator";
import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import ProfileResposeInterface from "./types/profileResponse.interface";

@Controller('api/profiles')
export class ProfileController{

    constructor(private readonly profileService: ProfileService){}

    @Get(':username')
    async getProfile(@User('id') userId: number, @Param('username') profileUsername : string): Promise<ProfileResposeInterface>{
        return await this.profileService.getProfile(userId, profileUsername);
    }

    @Post(':username/follow')
    @UseGuards(AuthGuard)
    async followProfile(@User('id') userId: number, @Param('username') profileUsername : string): Promise<ProfileResposeInterface>{
        return await this.profileService.followProfile(userId, profileUsername);
    }

    @Delete(':username/follow')
    @UseGuards(AuthGuard)
    async unfollowProfile(@User('id') userId: number, @Param('username') profileUsername : string): Promise<ProfileResposeInterface>{
        return await this.profileService.unfollowProfile(userId, profileUsername);
    }
}