import * as mongoose  from 'mongoose';
export enum REPORT_TYPE{
    REPORT_MANGA="REPORT_MANGA"
}
export const reportSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:"user"
    },
    manga_id:{
        type:mongoose.Types.ObjectId,
        ref:"manga"
    },
    report_type:{
        type:String,
        default:REPORT_TYPE.REPORT_MANGA
    },
    reason:{
        type:String,
        default:"hello"
    }
},{timestamps:true})
export interface Report extends mongoose.Document {
    user_id?:string,
    manga_id?:string,
    report_type?:string,
    reason?:string
}