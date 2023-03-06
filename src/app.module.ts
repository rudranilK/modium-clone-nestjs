import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from '@app/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '@app/ormconfig';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), TagModule, UserModule],
  controllers: [AppController],
  providers: [AppService],    // 'UserService' Module is needed in Auth middleware as we are using the DB call there
})
export class AppModule implements NestModule{           //Implementing Auth middleware globally for all reqs except a few
  configure(consumer: MiddlewareConsumer) {         
    consumer
    .apply(AuthMiddleware)
    .exclude('api/users(.*)')                          // Skip for every route that has '/api/users' in it. e.g. '/api/users' && '/api/users/login'
    // .forRoutes(UserController)
    .forRoutes({
      path: '*',
      method: RequestMethod.ALL
    })
  }
}
