import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { chapterSchema } from 'src/database/chapter.model';
import { mangaSchema } from 'src/database/manga.model';
import { userSchema } from 'src/database/user.model';
import { CommentSchema } from 'src/database/comment.model';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:"chapter",schema:chapterSchema},
      {name:"manga",schema:mangaSchema},
      {name:"user",schema:userSchema},
      {name:"comment",schema:CommentSchema},
    ])
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports:[NotificationService]
})
export class NotificationModule {}
