import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ShareModule } from './shared/shared.module';
import { MangaModule } from './modules/manga/manga.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { CategoryModule } from './modules/category/category.module';
import { UserModule } from './modules/user/user.module';
import { CommentModule } from './modules/comment/comment.module';
import { RequestCheckMiddleware } from './common/middleware/usermiddleware';

@Module({
  imports: [ShareModule, MangaModule, ChapterModule,CategoryModule,UserModule, CommentModule],
  controllers: [],
  providers: [],
})
export class AppModule  implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestCheckMiddleware)
      .forRoutes('*');
  }
}
