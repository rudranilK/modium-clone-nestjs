import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagController } from "./tag.controller";
import { TagEntity } from "./tag.entity";
import { TagService } from "./tag.service";

@Module({
    imports: [TypeOrmModule.forFeature([TagEntity])],       //linking type-orm in our module
    controllers: [TagController],
    providers: [TagService],
})
export class TagModule{

}