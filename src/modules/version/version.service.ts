import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Version } from 'src/database/version.model';

@Injectable()
export class VersionService {
    constructor(
        @InjectModel("version") private readonly versionModel:Model<Version>
    ){}
    async createNewVersion(name:string,version_type:string,support:boolean){
        return this.versionModel.create({
            name:name,
            version_type:version_type,
            support:support
        })
    }
    async getListVersion(version_type):Promise<Version[]>{
        return this.versionModel.find({
            version_type:version_type
        }).sort({createdAt:-1})
    }
    async checkUpdateVersion(name:string,version_type:string):Promise<boolean>{
        let updateStatus = true ;
        let listVersion = await this.versionModel.find({version_type:version_type});
        listVersion.forEach((version)=>{
            if(version.name==name){
                updateStatus=version.support;
            }
        })
        return updateStatus ;
    }
}
