import { AuthGuard } from '@app/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ArticleService } from './article.service';
import CreateArticleDto from './dto/createArticle.dto';
import ArticleResponseInterface from './types/articleResponse.interface';

@Controller('/api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createArticle( @User() user: UserEntity, @Body('article') createArticleDto: CreateArticleDto ): Promise<ArticleResponseInterface> {
    return await this.articleService.createArticle(user, createArticleDto);
  }

  @Get(':slug')
  async getArticle(@Param('slug') slug: string): Promise<ArticleResponseInterface | {}>{
    return await this.articleService.getArticleBySlug(slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(@User('id') userId: number, @Param('slug') slug: string, @Body('article') updateArticleDto: CreateArticleDto): Promise<ArticleResponseInterface> {
    return await this.articleService.updateArticle(userId, slug, updateArticleDto);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async removeArticle(@Param('slug') slug: string, @User('id') userId: number){
    return await this.articleService.removeArticleBySlug(slug, userId);
  }
}
