import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TagEntity } from "./tag.entity";

@Injectable()
export class TagService{

    constructor(
        @InjectRepository(TagEntity) 
        private readonly tagRepository: Repository<TagEntity>
    ){}

    async getTags(): Promise<{ "tags": string[] }>{

        const data = await this.tagRepository.find();
        return {
            "tags": data.map(e => e.name)
        };
    }
}