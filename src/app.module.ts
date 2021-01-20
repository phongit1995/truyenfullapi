import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ShareModule } from './shared/shared.module';
import { MangaModule } from './modules/manga/manga.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { CategoryModule } from './modules/category/category.module';
import { UserModule } from './modules/user/user.module';
import { CommentModule } from './modules/comment/comment.module';
import { RequestCheckMiddleware } from './common/middleware/usermiddleware';
import { UploadModule } from './modules/upload/upload.module';
import { VersionModule } from './modules/version/version.module';
import { CronjobModule } from './modules/cronjob/cronjob.module';

@Module({
  imports: [ShareModule, MangaModule, ChapterModule,CategoryModule,UserModule, CommentModule, UploadModule, VersionModule, CronjobModule],
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
