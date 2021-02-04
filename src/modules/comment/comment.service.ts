import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ERROR_TYPE } from 'src/common/constants/error';
import { Comment } from 'src/database/comment.model';
import { ChapterService } from '../chapter/chapter.service';
import { MangaService } from '../manga/manga.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel('comment') private commentModel:Model<Comment>,
        private mangaService:MangaService,
        private chapterService:ChapterService,
        private notificationService:NotificationService
    ){}
    async commentToManga(manga_id:string,user_id:string,message:string){
        const Manga = await this.mangaService.getDetialMangaById(manga_id);
        if(!Manga){
            throw new HttpException(ERROR_TYPE.MANGA_NOT_FOUND,HttpStatus.BAD_REQUEST)
        }
        await this.mangaService.addCountComment(manga_id,1);
        let comment =await this.commentModel.create({user:user_id,message:message,manga:manga_id});
        this.notificationService.sendNotificationWhenCommentManga(user_id,Manga._id,Manga.name,comment.createdAt);
        return comment ;
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
        let comment =await this.commentModel.create({user:user_id,message:message,manga:Chapter.manga as string,chapter:chapter_id});
        return comment ;
    }
    async getListTopComment(page:number,numberItem:number){
        return this.commentModel.find()
        .populate({
            path:"manga",
            select:"name image _id author"
        })
        .populate({
            path:"chapter",
            select:"title index _id"
        })
        .populate({
            path:'user',
            select:"name avatar _id"
        })
        .sort({createdAt:-1})
        .skip((page-1)*numberItem).limit(numberItem).select("-reply");
    }
    async getListCommentInManga(manga_id:string,page:number,numberItem:number):Promise<Array<Comment>>{
        return this.commentModel.find({
            manga:manga_id
        }).populate({
            path:"chapter",
            select:"title index _id"
        })
        .populate({
            path:'user',
            select:"name avatar _id"
        })
        .sort({createdAt:-1})
        .skip((page-1)*numberItem).limit(numberItem).select("-reply");
    }
    async getListCommentInChapter(chapter_id:string,page:number,numberItem:number):Promise<Array<Comment>>{
        return this.commentModel.find({
            chapter:chapter_id
        })
        .populate({
            path:'user',
            select:"name avatar _id"
        }).sort({createdAt:-1})
        .skip((page-1)*numberItem).limit(numberItem).select("-reply");
    }
    async getDetialComment(comment_id:string):Promise<Comment>{
        return this.commentModel.findById(comment_id)
        .populate({
            path:'user',
            select:"name avatar _id"
        })
        .populate({
            path:"reply.user",
            select:"name avatar _id"
        })
    }
    async replyComment(user_id:string,comment_id:string,message:string):Promise<Comment>{
        const comment = await this.commentModel.findById(comment_id);
        if(!comment){
            throw new HttpException(ERROR_TYPE.COMMENT_NOT_FOUND_OR_DELETED,HttpStatus.BAD_REQUEST)
        }
        return this.commentModel.findByIdAndUpdate(
        comment_id,{
            $inc:{replyCount:1},
            $push:{
                reply:{
                    user:user_id,
                    message:message
                }
            }
        })
    }
}
