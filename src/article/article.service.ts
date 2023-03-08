import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import CreateArticleDto from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import ArticleResponseInterface from './types/articleResponse.interface';
import { omit } from 'lodash';
import slugify from 'slugify';

@Injectable()
export class ArticleService {

  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity> ){}

  async createArticle(user: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleResponseInterface> {

    //creating a new article
    const article = new ArticleEntity();

    //ATM, article is blank
    Object.assign(article, createArticleDto);
    if(!article.tagList) {                      // as tagList is not mandatory it m,ight be undefined
      article.tagList = [];
    }
    article.author = user;
    article.slug = this.getSlug(article.title);

    //Saving the article in DB
    let newArticle = await this.articleRepository.save(article);

    return this.buildArticleResponse(newArticle);
  }

  findAll() {
    return `This action returns all article`;
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ where: { slug } });    //If 'slug' is not unique, it will fetch the 1st one
  }

  async getArticleBySlug(slug: string): Promise<ArticleResponseInterface | {}> {
    const article = await this.findBySlug(slug);

    if(article) return this.buildArticleResponse(article);
    return { result: HttpStatus.NOT_FOUND};
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  async removeArticleBySlug(slug: string, userId: number): Promise<DeleteResult> {

    const article = await this.findBySlug(slug);

    if(!article) throw new HttpException(`Article does not exist!!`, HttpStatus.NOT_FOUND);

    if(article.author?.id !== userId) throw new HttpException(`You are not an Author!!`, HttpStatus.FORBIDDEN);
      
    return await this.articleRepository.delete({
      slug,
      id: article.id
    });
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
      article.author = omit( article.author, ['id', 'email'] );
      return {
        article: article
      }
  }

  private getSlug(title: string): string{
    return ( slugify(title, { lower: true} )
    + '-' +
    ((Math.random() * Math.pow(36, 6)) | 0 ).toString(36));     //Expression to generate unique string
  }
}
