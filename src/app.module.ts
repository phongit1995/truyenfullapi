import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShareModule } from './shared/shared.module';
import { MangaModule } from './modules/manga/manga.module';
import { ChapterModule } from './modules/chapter/chapter.module';

@Module({
  imports: [ShareModule, MangaModule, ChapterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
