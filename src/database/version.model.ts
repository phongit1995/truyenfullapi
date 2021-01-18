import * as mongoose  from 'mongoose';
export enum VERSION_TYPE {
    ANDROID="ANDROID",
    IOS="IOS"
}
export const versionSchema = new mongoose.Schema({
    version_type:{
        type:String,
        default:VERSION_TYPE.ANDROID
    },
    name:{
        type:String
    },
    support:{
        type:Boolean,
        default:true
    }
},{timestamps:true})
export interface Version extends mongoose.Document{
    version_type?:string,
    name?:string,
    support?:boolean
}