import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { chapterSchema } from 'src/database/chapter.model';
import { MangaModule } from '../manga/manga.module';

@Module({
  imports:[
    MangaModule,
    MongooseModule.forFeature([{name:"chapter",schema:chapterSchema}]),
  ],
  providers: [ChapterService],
  controllers: [ChapterController]
})
export class ChapterModule {}
