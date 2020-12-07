import * as mongoose  from 'mongoose';
export const CommentSchema:mongoose.Schema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    },
    message:{
        type:String
    }
},
{timestamps:true})
export interface Comment extends mongoose.Document {
}