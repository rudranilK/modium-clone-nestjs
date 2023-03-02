import { Controller, Get } from "@nestjs/common";
import { TagService } from "./tag.service";
import { TagEntity } from "./tag.entity";


@Controller('/api/tags')
export class TagController{

    constructor(private readonly tagService: TagService){}

    @Get()
    async findAll(): Promise<{"tags": string[]}>{
        return await this.tagService.getTags();
    }
}
