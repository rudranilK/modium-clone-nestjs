import { ArticleEntity } from "../article.entity";

export default interface ArticlesResponseInterface{
    articles: ArticleEntity[];
    articlesCount: number;
}