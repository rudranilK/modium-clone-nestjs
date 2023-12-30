import { AuthGuard } from '@app/guards/auth.guard';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, UsePipes, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import CreateArticleDto from './dto/createArticle.dto';
import ArticleResponseInterface from './types/articleResponse.interface';
import ArticlesResponseInterface from './types/articlesResponse.interface';

@Controller('/api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async createArticle( @User() user: UserEntity, @Body('article') createArticleDto: CreateArticleDto ): Promise<ArticleResponseInterface> {
    return await this.articleService.createArticle(user, createArticleDto);
  }

  @Get('/feed')
  @UseGuards(AuthGuard)
  async getUserFeed(@User('id') userId: number, @Query() query: any ): Promise<ArticlesResponseInterface> {
    return await this.articleService.getUserFeed(userId, query);
  }

  @Get(':slug')
  async getArticle(@Param('slug') slug: string): Promise<ArticleResponseInterface | {}>{
    return await this.articleService.getArticleBySlug(slug);
  }

  @Get()
  async findAll(@User('id') userId: number, @Query() query: any ): Promise<ArticlesResponseInterface> {
    return await this.articleService.findAll(userId, query);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async updateArticle(@User('id') userId: number, @Param('slug') slug: string, @Body('article') updateArticleDto: CreateArticleDto): Promise<ArticleResponseInterface> {
    return await this.articleService.updateArticle(userId, slug, updateArticleDto);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async removeArticle(@Param('slug') slug: string, @User('id') userId: number){
    return await this.articleService.removeArticleBySlug(slug, userId);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async likeArticle(@Param('slug') slug: string, @User('id') userId: number): Promise<ArticleResponseInterface>{
    return await this.articleService.likeArticle(slug, userId) as any;
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async dislikeArticle(@Param('slug') slug: string, @User('id') userId: number): Promise<ArticleResponseInterface>{
    return await this.articleService.dislikeArticle(slug, userId) as any;
  }

}
