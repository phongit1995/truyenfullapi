import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ERROR_TYPE } from 'src/common/constants/error';
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
    async commentToManga(manga_id:string,user_id:string,message:string){
        const Manga = await this.mangaService.getDetialMangaById(manga_id);
        if(!Manga){
            throw new HttpException(ERROR_TYPE.MANGA_NOT_FOUND,HttpStatus.BAD_REQUEST)
        }
        await this.mangaService.addCountComment(manga_id,1);
        return this.commentModel.create({user:user_id,message:message,manga:manga_id});
    }
    async commentToChapter(chapter_id:string,user_id:string,message:string){
        const Chapter = await this.chapterService.getDetialChapter(chapter_id);
        if(!Chapter){
            throw new HttpException(ERROR_TYPE.CHAPTER_NOT_FOUND,HttpStatus.BAD_REQUEST)
        }
        await Promise.all([
            this.mangaService.addCountComment(Chapter.manga as string,1),
            this.chapterService.addCommentCount(chapter_id,1)
        ])
        return this.commentModel.create({user:user_id,message:message,manga:Chapter.manga as string,chapter:chapter_id});
    }
    async getListCommentInManga(manga_id:string,page:number,numberItem:number):Promise<Array<Comment>>{
        return this.commentModel.find({
            manga:manga_id
        }).populate({
            path:"chapter",
            select:"title index _id"
        }).skip((page-1)*numberItem).limit(numberItem).select("-reply");
    }
}
