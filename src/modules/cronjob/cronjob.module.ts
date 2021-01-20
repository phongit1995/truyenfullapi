import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { chapterSchema } from 'src/database/chapter.model';
import { mangaSchema } from 'src/database/manga.model';
import { CronjobService } from './cronjob.service';

@Module({
  imports:[
      ScheduleModule.forRoot(),
      MongooseModule.forFeature([
          {name:"manga",schema:mangaSchema},
          {name:"chapter",schema:chapterSchema}
      ])
  ],
  providers: [CronjobService]
})
export class CronjobModule {}
