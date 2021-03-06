import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from 'src/database/comment.model';
import { MangaModule } from '../manga/manga.module';
import { ChapterModule } from '../chapter/chapter.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'comment',schema:CommentSchema}]),
    MangaModule,
    ChapterModule,
    NotificationModule
  ],
  providers: [CommentService],
  controllers: [CommentController]
})
export class CommentModule {}
