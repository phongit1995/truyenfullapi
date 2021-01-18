const {getListLinkInPage,getDetialComic,listCommitNotUpdate,getContentComic} = require('./getComic');
require("dotenv").config();
let mongoose = require("mongoose");
var Redis = require('ioredis');
const redis = require("redis");
let kue = require('kue');
const client = redis.createClient();
client.flushdb( function (err, succeeded) {
    console.log("Xóa Thành Công :" + succeeded); // will be true if successfull
});
mongoose.connect(`${process.env.MONGO_URL}`, {useNewUrlParser: true,useUnifiedTopology: true ,useCreateIndex: true,useFindAndModify:false},(error)=>{
    if(error){
        console.log(error);
        console.log('Thất Bại');
    }else {
        console.log('Connect successed to mongo');
    }
});
let queue  = kue.createQueue({
    redis: {
        createClientFactory: function(){
            return new Redis();
        }
    },
});
// Get ALL Link In Chapter
// for (let i=1;i<=777;i++){
//     let job = queue.create("getLinkCommic",i).attempts(3).save(function(error) {
//         if (!error) console.log(job.id);
//         else console.log(error);
//     });
// }
// queue.process("getLinkCommic",4,function(job,done){
//     getListLinkInPage(job.data).then((data)=>{
//         console.log("page "+ job.data  + " Chapter  : "+data);
//         done()
//     })
//     .catch(error=>{
//         console.log(error);
//     })
// })
// //getListLinkInPage(4);
listCommitNotUpdate().then(data=>{
    data.forEach((item)=>{
        let job = queue.create("getChapterComic",{url:item.url,id:item._id}).delay(500).save(function(error) {
            if (!error) console.log(job.id);
            else console.log(error);
        });
        
    })
})
queue.process("getChapterComic",1, function(job,done){
    getDetialComic(job.data.url,job.data.id).then((data)=>{
        console.log(job.data.url + " : So Page " + data.lengthPage  + "  Số Chapter : " + data.Chapter );
        done()
    }).catch(error=>{
        console.log(error);
        console.error("Lỗi URL:" + job.data.url);

        done()
    })
})
kue.app.listen(5000);
// getDetialComic("https://truyenfull.vn/tra-sua-vi-em/","5fc9b9221a730b2db415f35b");
//getContentComic("https://truyenfull.vn/tui-nho-ben-nguc-trai/chuong-5/");