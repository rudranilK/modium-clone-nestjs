import { ArticleEntity } from "../article.entity";

type ArticleType = Omit<ArticleEntity, 'updateTimestamp'>

export default interface ArticlesResponseInterface{
    articles: ArticleType[];
    articlesCount: number;
}