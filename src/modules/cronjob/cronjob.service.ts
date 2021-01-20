import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron ,Timeout ,CronExpression} from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Chapter } from 'src/database/chapter.model';
import { Manga } from 'src/database/manga.model';
import { RequestService } from 'src/shared/services/request.service';
import * as cheerio from 'cheerio';
@Injectable()
export class CronjobService {
    constructor(
        @InjectModel("manga") private readonly mangaModel:Model<Manga>,
        @InjectModel("chapter") private readonly chapterModel:Model<Chapter>,
        private requestService:RequestService
    ){}
    private readonly URL_WEBSITE="https://truyenfull.vn/"
    @Timeout(1000)
    async handleCron(){
        console.log("Phong");
       const listUrlNeedUpdate = await this.getListUrlNewsManga();
       console.log("LIST URL NEED UPDATE : " + listUrlNeedUpdate.length);
       const listMangaUpdate = await this.getListMangaByUrl(listUrlNeedUpdate);
       if(listMangaUpdate.length==0){
           return ;
       }
       console.log(listMangaUpdate.length); 
       await this.updateMangaInfo(listMangaUpdate[0]);
    }
    async getListUrlNewsManga():Promise<string[]>{
        const resultFetch  = await this.requestService.getMethod(this.URL_WEBSITE);
        const $ = cheerio.load(resultFetch);
        let listLink:string[] = [];
        $("#list-index > div.list.list-truyen.list-new.col-xs-12.col-sm-12.col-md-8.col-truyen-main > div[class=row] > div.col-xs-9.col-sm-6.col-md-5.col-title > h3 > a").each(function(){
            listLink.push($(this).attr("href"))
        })
        return listLink ;
    }
    async getListMangaByUrl(listUrl:string[]):Promise<Manga[]>{
        return this.mangaModel.find({
            url:{$in:listUrl}
        })
    }
    async updateMangaInfo(manga:Manga){
        //const listChapter = await this.chapterModel.find({manga:manga._id}).sort({index:-1});
        //console.log(listChapter.length);
        console.log(manga.url);
        await this.getListNewChapterByUrl(manga.url);
    }
    async getListNewChapterByUrl(url){
        const resultFetch = await this.requestService.getMethod(url);
        const $ = cheerio.load(resultFetch);
        console.log($(".l-chapters>li>a").length);
    }
}
