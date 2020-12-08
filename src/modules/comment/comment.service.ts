import { Injectable, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Comment } from 'src/database/comment.model';
import { ChapterService } from '../chapter/chapter.service';
import { MangaService } from '../manga/manga.service';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel('comment') private commentModel:Model<Comment>,
        private mangaService:MangaService,
        private chapterService:ChapterService
    ){}
    @Post("comment-manga")
    @ApiOperation({summary:"Comment To Manga"})
    @ApiResponse({ status: 200, description: 'Comment Success Full.'})
    @UsePipes(new ValidationPipe())
    async commentToManga(){

    }
    @Post("comment-chapter")
    @ApiOperation({summary:"Comment To Chapter"})
    @ApiResponse({ status: 200, description: 'Comment Success Full.'})
    @UsePipes(new ValidationPipe())
    async commentToChapter(){

    }
}
