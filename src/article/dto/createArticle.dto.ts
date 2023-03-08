import { IsNotEmpty } from "class-validator";

export default class CreateArticleDto {

    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly description: string;

    @IsNotEmpty()
    readonly body: string;
    
    readonly tagList?: string[];
}
