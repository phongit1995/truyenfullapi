const {getListLinkInPage,getDetialComic} = require('./getComic');
require("dotenv").config();
let mongoose = require("mongoose");
mongoose.connect(`${process.env.MONGO_URL}`, {useNewUrlParser: true,useUnifiedTopology: true ,useCreateIndex: true,useFindAndModify:false},(error)=>{
    if(error){
        console.log(error);
        console.log('Thất Bại');
    }else {
        console.log('Connect successed to mongo');
    }
    });
    getDetialComic("https://truyenfull.vn/co-vo-than-bi-muon-chay-dau-280620/");