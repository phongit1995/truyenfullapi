import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { chapterSchema } from 'src/database/chapter.model';
import { mangaSchema } from 'src/database/manga.model';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:"chapter",schema:chapterSchema},
      {name:"manga",schema:mangaSchema}
    ])
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports:[NotificationService]
})
export class NotificationModule {}
