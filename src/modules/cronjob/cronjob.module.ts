import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { chapterSchema } from 'src/database/chapter.model';
import { mangaSchema } from 'src/database/manga.model';
import { NotificationModule } from '../notification/notification.module';
import { CronjobService } from './cronjob.service';

@Module({
  imports:[
      ScheduleModule.forRoot(),
      MongooseModule.forFeature([
          {name:"manga",schema:mangaSchema},
          {name:"chapter",schema:chapterSchema}
      ]),
      NotificationModule
  ],
  providers: [CronjobService]
})
export class CronjobModule {}
