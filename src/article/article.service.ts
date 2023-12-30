import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import CreateArticleDto from './dto/createArticle.dto';
import ArticleResponseInterface from './types/articleResponse.interface';
import { omit } from 'lodash';
import slugify from 'slugify';
import ArticlesResponseInterface from './types/articlesResponse.interface';
import { FollowEntity } from '@app/profile/follow.entity';

@Injectable()
export class ArticleService {

  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) 
    private readonly userRepository: Repository<UserEntity>, 
    @InjectRepository(FollowEntity) 
    private readonly followRepository: Repository<FollowEntity>, 
    private dataSource: DataSource ){}       //We don't need all these repos's, We can use the datasource & querybuilder only! We can refactor it later!

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

  async findAll(userId: number, query: any): Promise<ArticlesResponseInterface> {

    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author','author')         // 2nd param is alias for the joined column
      .orderBy('articles.createdAt', 'DESC');

  //Filter by Tag
    if(query.tag){
      queryBuilder.andWhere('articles.tagList LIKE :tag', {   // 'andWhere()' allows us to add more and more condtions to where clause!
        tag: `%${query.tag}%`
      });   
    }

  //Filter by author
    if(query.author){
      queryBuilder.andWhere('author.username = :author', {  
        author: query.author
      });   
    }
  
  //Filter by favourited
    if(query.favorited){
  
        let satisfied = false;
  
      //Fetching relation 'favorites' which is not included in Auth middleware
        const user = await this.userRepository.findOne({
          where: { username: query.favorited },
          relations: ['favorites']
        });
  
        if(user){                                       // The username might not exist!!
  
          let articleIds = user.favorites.map(e => e.id);
  
          if(articleIds.length){
  
            queryBuilder.andWhere('articles.id IN (:...ids)', {
              ids: articleIds
            });
  
            satisfied = true;
          }
        }
  
        if(!satisfied){                     //If the username doesn't have any favourited article || user doesn't exist, we must return empty array!!
          queryBuilder.andWhere('1=0');     //This condition always reults to false, hence empty array will be returned!
        }
    }
    
  //After applying the filter, fetch count
    const articlesCount = await queryBuilder.getCount();

  //Paginating the data finally before fetching
    queryBuilder.limit( query.limit? query.limit: 10 )
      .offset( query.offset? query.offset: 0 );

  //Calculate the favourited property to display 'liked' for logged in user - PART 1
    let favouriteIds: number[] = [];
    if(userId){
      const currentUser = await this.userRepository.findOne({                  // We have to use this extra query, 
        where: { id: userId },                                          // otherwise we won't get the 'favourites' part.
        relations: ['favorites']
      });

      favouriteIds = currentUser.favorites.map( i => i.id );
    }

  //DB call
    const articles = await queryBuilder.getMany();

  //Calculate favorited property - PART 2
    const favouritedArticles = articles.map( item => { 
      const favorited = favouriteIds.includes(item.id);
      return { ...item, favorited };
    });

    return { articles: favouritedArticles , articlesCount };
  }

  async getUserFeed(userId: number, query: any): Promise<ArticlesResponseInterface> {

    //Get followed user list.
    const followedUsers = await this.followRepository.find({
      where: { followerId: userId }
    });

    if(!followedUsers.length){        //If user is not following anyone - feed will be empty!
      return { articles: [] , articlesCount: 0 }
    }

    const followedIds = followedUsers.map( i => i.followingId );

    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author','author')
      .where('author.id IN (:...ids)', { ids: followedIds })
      .orderBy('articles.createdAt', 'DESC');

  // //Filter by favourited
  //   if(query.favorited){
  
  //       let satisfied = false;
  
  //     //Fetching relation 'favorites' which is not included in Auth middleware
  //       const user = await this.userRepository.findOne({
  //         where: { username: query.favorited },
  //         relations: ['favorites']
  //       });
  
  //       if(user){                                       // The username might not exist!!
  
  //         let articleIds = user.favorites.map(e => e.id);
  
  //         if(articleIds.length){
  
  //           queryBuilder.andWhere('articles.id IN (:...ids)', {
  //             ids: articleIds
  //           });
  
  //           satisfied = true;
  //         }
  //       }
  
  //       if(!satisfied){                     //If the username doesn't have any favourited article || user doesn't exist, we must return empty array!!
  //         queryBuilder.andWhere('1=0');     //This condition always reults to false, hence empty array will be returned!
  //       }
  //   }
    
  //After applying the filter, fetch count
    const articlesCount = await queryBuilder.getCount();

  //Paginating the data finally before fetching
    queryBuilder.limit( query.limit? query.limit: 10 )
      .offset( query.offset? query.offset: 0 );

  // //Calculate the favourited property to display 'liked' for logged in user - PART 1
  //   let favouriteIds: number[] = [];
  //   if(userId){
  //     const currentUser = await this.userRepository.findOne({                  // We have to use this extra query, 
  //       where: { id: userId },                                          // otherwise we won't get the 'favourites' part.
  //       relations: ['favorites']
  //     });

  //     favouriteIds = currentUser.favorites.map( i => i.id );
  //   }

  //DB call
    const articles = await queryBuilder.getMany();

  // //Calculate favorited property - PART 2
  //   const favouritedArticles = articles.map( item => { 
  //     const favorited = favouriteIds.includes(item.id);
  //     return { ...item, favorited };
  //   });

    // return { articles: favouritedArticles , articlesCount };
    return { articles: articles , articlesCount };
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ where: { slug } });    //If 'slug' is not unique, it will fetch the 1st one
  }

  async getArticleBySlug(slug: string): Promise<ArticleResponseInterface | {}> {
    const article = await this.findBySlug(slug);

    if(article) return this.buildArticleResponse(article);
    return { result: HttpStatus.NOT_FOUND};
  }

  async updateArticle(userId: number, slug: string, updateArticleDto: CreateArticleDto): Promise<ArticleResponseInterface> {

    const article = await this.findLegitArticle(userId, slug);

    Object.assign(article, updateArticleDto);
    article.slug = this.getSlug(article.title);

    const result = await this.articleRepository.save(article);

    return this.buildArticleResponse(result);
  }

  private async findLegitArticle(userId: number, slug: string): Promise<ArticleEntity>{
    const article = await this.findBySlug(slug);

    if(!article) throw new HttpException(`Article does not exist!!`, HttpStatus.NOT_FOUND);

    if(article.author?.id !== userId) throw new HttpException(`You are not an Author!!`, HttpStatus.FORBIDDEN);

    return article;
  }

  async removeArticleBySlug(slug: string, userId: number): Promise<DeleteResult> {

    const article = await this.findLegitArticle(userId, slug);
      
    return await this.articleRepository.delete({
      slug,
      id: article.id
    });
  }

  async likeArticle(slug: string, userId: number): Promise<ArticleResponseInterface>{

    let article = await this.findBySlug(slug);                        // This API is missing the edgecase if 'article = null' -> 400 BAD REQUEST

    const user = await this.userRepository.findOne({                  // We have to use this extra query, 
      where: { id: userId },                                          // otherwise we won't get the 'favourites' part.
      relations: ['favorites']
    });

    const isNotLiked = user.favorites.findIndex(item => item.id === article?.id) === -1;

    if(isNotLiked){                                                   // 'users_favorites_articles' -> We won't work with this table directly!!
      user.favorites.push(article);
      article.favoritesCount++;

      await this.userRepository.save(user);
      article = await this.articleRepository.save(article);
    }

    return this.buildArticleResponse(article); 
  }

  //Refactor likeAtricle() & dislikeArticle() methods!!
  async dislikeArticle(slug: string, userId: number): Promise<ArticleResponseInterface>{

    let article = await this.findBySlug(slug);                        // This API is missing the edgecase if 'article = null' -> 400 BAD REQUEST

    const user = await this.userRepository.findOne({                  // We have to use this extra query, 
      where: { id: userId },                                          // otherwise we won't get the 'favourites' part.
      relations: ['favorites']
    });

    const articleIndex = user.favorites.findIndex(item => item.id === article?.id);

    if(articleIndex > -1){                                             
      user.favorites.splice(articleIndex,1);
      article.favoritesCount--;

      await this.userRepository.save(user);
      article = await this.articleRepository.save(article);
    }

    return this.buildArticleResponse(article); 
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
