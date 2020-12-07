import * as mongoose  from 'mongoose';
export enum ROLE_USER{
    MEMBER="MEMBER",
    ADMIN="ADMIN"
}
export const userSchema:mongoose.Schema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    avatar:{
        type:String,
        default:"https://vuecidity.wemakesites.net/static/images/avatar-01.png"
    },
    phone:{
        type:String
    },
    gender:{
        type:Number,
        default:1
    },
    role:{
        type:String,
        default:ROLE_USER.MEMBER
    },
    vip:{
        type:Boolean,
        default:false
    },
    vip_time:{
        type:Date,
        default:Date.now
    }
},{timestamps:true})
export interface User extends mongoose.Document {
   name?:string,
   email?:string,
   password?:string,
   avatar?:string,
   phone?:string,
   role?:string,
   gender?:number,
   vip?:boolean,
   vip_time?:Date,
   token?:string
}