import { Module } from '@nestjs/common';
import { ShareModule } from './shared/shared.module';
import { MangaModule } from './modules/manga/manga.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { CategoryModule } from './modules/category/category.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [ShareModule, MangaModule, ChapterModule,CategoryModule,UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
