import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, REPORT_TYPE } from 'src/database/report.model';

@Injectable()
export class ReportService {
    constructor(
        @InjectModel("report") private readonly reportModel:Model<Report>
    ){}
    async createNewMangaReport(manga_id:string,reason:string,user_id?:string):Promise<Report>{
        return this.reportModel.create({
            user_id:user_id,
            manga_id:manga_id,
            reason:reason
        })
    }
    async getListMangaReport(page:number,numberItem:number):Promise<Report[]>{
        return this.reportModel.find({
            report_type:REPORT_TYPE.REPORT_MANGA
        }).populate({
            path:"manga_id",
            select:"_id image name",
            match: { enable: true }
        }).sort({createdAt:-1})
        .skip((page-1)*numberItem)
        .limit(numberItem)
    }
}
