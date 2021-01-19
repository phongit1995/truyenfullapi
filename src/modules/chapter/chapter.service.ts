import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ERROR_TYPE } from 'src/common/constants/error';
import { Chapter, chapterSchema } from 'src/database/chapter.model';
import { CacheService } from 'src/shared/services/cache/cache.service';
import { RequestService } from 'src/shared/services/request.service';
import * as cheerio from 'cheerio';
import { MangaService } from '../manga/manga.service';

@Injectable()
export class ChapterService {
    constructor(@InjectModel("chapter")private chapterModel:Model<Chapter>,
    private cacheService:CacheService,
    private requestService:RequestService,
    private mangaService:MangaService){}
    async getListChapterManga(manga_id:string,page:number,numberItem:number):Promise<Array<Chapter>>{
        const KEY_CACHE= "CACHE_LIST_CHAPTER_"+manga_id+"_"+page+"_"+numberItem;
        let dataCache= await this.cacheService.get<Chapter[]>(KEY_CACHE);
        if(dataCache){
            return dataCache;
        }
        dataCache =await  this.chapterModel.find({
            manga:manga_id
        })
        .skip((page-1)*numberItem)
        .limit(numberItem)
        .sort({index:1})
        .select("-images -url -updatedAt -source -manga -content");
        await this.cacheService.set(KEY_CACHE,dataCache,1000*60*30);
        return dataCache;
    }
    async totalNumberChapter(manga_id:string):Promise<number>{
        const KEY_CACHE:string="NUMBER_CHAPTER_"+ manga_id ;
        let resultCacheNumberChapter = await this.cacheService.get<number>(KEY_CACHE);
        if(resultCacheNumberChapter){
            return resultCacheNumberChapter;
        }
        resultCacheNumberChapter=await  this.chapterModel.countDocuments({
            manga:manga_id
        })
        await this.cacheService.set(KEY_CACHE,resultCacheNumberChapter,1000*60*5);
        return resultCacheNumberChapter;
    }
    async getDetialChapter(chapter_id:string):Promise<Chapter>{
        const KEY_CACHE= "CACHE_DETIAL_CHAPTER_"+chapter_id;
        let dataCache= await this.cacheService.get<Chapter>(KEY_CACHE);
        if(dataCache){
            await this.IncrementToManga(dataCache.manga as string);
            return dataCache;
        }
        let chapter = await this.chapterModel.findById(chapter_id);
        if(!chapter){
            throw new HttpException(ERROR_TYPE.CHAPTER_NOT_FOUND,HttpStatus.BAD_REQUEST);
        }
        if(!chapter.content){
            const content = await this.getContentChapter(chapter.url);
            chapter.content = content ;
            await chapter.save();
        }
        if(chapter.before==undefined &&chapter.after==undefined){
            const [beforeChapter,afterChapter]= await Promise.all([
                this.chapterModel.findOne({manga:chapter.manga,index:chapter.index-1}),
                this.chapterModel.findOne({manga:chapter.manga,index:chapter.index+1})
            ])
            chapter.before=  beforeChapter?._id ;
            chapter.after = afterChapter?._id ;
            await chapter.save();
        }
        await this.cacheService.set(KEY_CACHE,chapter,1000*60*30);
        await this.IncrementToManga(chapter.manga as string);
        return chapter ;
    }
    private async getContentChapter(url:string):Promise<string>{
        const data = await this.requestService.getMethod(url,{
            headers:{
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36"
            }
        });
        const $ = cheerio.load(data,{decodeEntities:false});
        const content =$("#chapter-c");
        content.children("div").remove();
        content.children("a").remove()
        let html:string =content.html() ;
        html= html.replace(/Nguồn/g,"");
        return html ;
    }
    private async IncrementToManga(manga_id:string):Promise<void>{
        const KEY_CACHE_VIEW_MANGA= "CACHE_VIEWS_MANGA"+manga_id;
        const dataKey = await this.cacheService.get<number>(KEY_CACHE_VIEW_MANGA);
        if(!dataKey){
            return this.cacheService.set(KEY_CACHE_VIEW_MANGA,1);
        }
        let radomViewsAdd:number = Math.floor(Math.random()*(10-5))+5;
        if(dataKey>=radomViewsAdd){
            await this.mangaService.IncreaseViewsManga(manga_id,radomViewsAdd);
            return await this.cacheService.set(KEY_CACHE_VIEW_MANGA,dataKey-radomViewsAdd+1);
        }
        await this.cacheService.set(KEY_CACHE_VIEW_MANGA,dataKey+1);
    }
    async deleteContentChapter(chapter_id:string):Promise<Chapter>{
        return this.chapterModel.findByIdAndUpdate(chapter_id,{$unset:{content:""}});
    }
    async addCommentCount(chapter_id:string,numberComment:number=1):Promise<any>{
        return this.chapterModel.findByIdAndUpdate(chapter_id,{$inc:{commentCount:numberComment}})
    }
}
