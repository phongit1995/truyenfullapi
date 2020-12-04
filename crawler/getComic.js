const request = require("request-promise");
let mangaDB = require( './model/manga');
let chapterDb = require("./model/chapter");
let  fs = require( 'fs');
let path = require ( 'path');
let cheerio = require("cheerio");
const UserAgent = require('./userAgent.json');
const getListLinkInPage= async (page)=>{
    const options={
        url:`https://truyenfull.vn/danh-sach/truyen-moi/trang-${page}/`,
        headers:{
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36"
        }
    }
    const data = await request(options);
    const $= cheerio.load(data);
    const listUrl = [];
    const comicInPage = $(".list-truyen .truyen-title >a");
    comicInPage.each(function(){
        listUrl.push( $(this).attr("href"));
    })
    const listPromise = listUrl.map((item)=>createNewManga(item));
    await Promise.all(listPromise);
    return listUrl.length;
}
const getDetialComic = async (url,manga_id)=>{
    const options={
        url:url,
        headers:{
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36"
        }
    }
    const data = await request(options);
    const $  = cheerio.load(data);
    const title = $("#truyen > div.col-xs-12.col-sm-12.col-md-9.col-truyen-main > div.col-xs-12.col-info-desc > h3").text();
    const description = $("#truyen > div.col-xs-12.col-sm-12.col-md-9.col-truyen-main > div.col-xs-12.col-info-desc > div.col-xs-12.col-sm-8.col-md-8.desc > div.desc-text").text();
    const author = $('a[itemprop="author"]').text();
    let status = $(".info >div:last-child>span").text();
    const image= $('img[itemprop="image"]').attr("src");
    let category = [];
    $('a[itemprop="genre"]').map(function(){
        category.push($(this).text())
    })
    status= status=="Đang ra"?0:1 ;
    const listChapter = $(".list-chapter>li>a");
    let Chapter = [];
    const pagination = $(".pagination.pagination-sm").length;
    let lengthPage= 0 ;
    const arrayPage = [];
    if(pagination>0){
        
        if($(".pagination.pagination-sm >li>a").length<5){
            lengthPage= $(".pagination.pagination-sm >li>a").length ;
        }
        else {
            const listLength =  $(".pagination.pagination-sm >li:not(.page-nav)>a").last().attr("href");
            let maxChapter = listLength.slice(0,listLength.lastIndexOf("/"));
            lengthPage = maxChapter.slice(maxChapter.lastIndexOf("-")+1,maxChapter.length);
        }
        for(i=1;i<=parseInt(lengthPage);i++){
            arrayPage.push(i);
        }
       let ListPromise = arrayPage.map((item)=> getListChapterInPageLink(url,item));
       let listLink = await Promise.all(ListPromise);
       Chapter = Chapter.concat(...listLink);
    }
    else{
        listChapter.each(function(index,element){
            const nameChapter = $(this).text();
            const urlChapter = $(this).attr("href");
            Chapter.push({name:nameChapter,url:urlChapter});
        })
    }
    const ListPromise = Chapter.map((chapter,index)=>createNewChapter(manga_id,chapter.url,index+1,chapter.name))
    const ListChapterDB =  await Promise.all(ListPromise);
    const listId = ListChapterDB.map(item=>item._id);
    await UpdateMangaInfo(manga_id,author,category,image,description,status,listId,listId[listId.length-1]);
    return {
        Chapter:Chapter.length,
        lengthPage:lengthPage
    } ;
}
const getListChapterInPageLink = async(url,page)=>{
    const urlPage = url +"trang-"+page ;
    const options={
        url:urlPage,
        headers:{
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36"
        }
    }
    const data = await request(options);
    const $  = cheerio.load(data);
    const listChapter = $(".list-chapter>li>a");
    const Chapter = [];
    listChapter.each(function(index,element){
        const nameChapter = $(this).text();
        const urlChapter = $(this).attr("href");
        Chapter.push({name:nameChapter,url:urlChapter});
    })
    return Chapter;
}
const getContentComic = async(url)=>{
    const options={
        url:url,
        headers:{
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36"
        }
    }
    const data = await request(options);
    const $= cheerio.load(data,{decodeEntities:false});
    const content =$("#chapter-c");
    content.children("div").remove();
    content.children("a").remove()
    let html =content.html() ;
    html= html.replace(/Nguồn/g,"");
    console.log(html);
    await chapterDb.updateOne({
        url:url
    },{content:html})
}
const createNewManga = async (url)=>{
    return mangaDB.create({url:url});
}
const createNewChapter=(manga_id,url,index,title)=>{
    return chapterDb.create({
        manga:manga_id,
        index:index,
        title:title,
        url:url
    })
}
const UpdateMangaInfo=(manga_id,author,category,image,description,manga_status,chapters,last_chapter)=>{
    return mangaDB.findByIdAndUpdate(manga_id,
        {
            author:author,
            category:category,
            image:image,
            description:description,
            chapters:chapters,
            last_chapter:last_chapter,
            manga_status:manga_status
        })
}
const listCommitNotUpdate= ()=>{
    return mangaDB.find({
        $or:[
            {
                description:{ $exists: false }
            },
            {
                chapters:{$size:0}
            }
        ]
    }).limit(3000);
}
module.exports ={
    getListLinkInPage,
    getDetialComic,
    listCommitNotUpdate,
    getContentComic
}