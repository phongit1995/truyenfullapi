const request = require("request-promise");
let mangaDB = require( './model/manga');
let chapterDb = require("./model/chapter");
let  fs = require( 'fs');
let path = require ( 'path');
let cheerio = require("cheerio");
const UserAgent = require('./userAgent.json');
const getListLinkInPage= async (page)=>{
    console.log("Phong")
}
const getDetialComic = async (url)=>{
    const options={
        url:url,
        headers:{
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36"
        }
    }
    const data = await request(options);
    const $  = cheerio.load(data);
    const listChapter = $(".list-chapter>li>a");
    const Chapter = [];
    const panigation = $(".pagination.pagination-sm").length;
    const listLength =  $(".pagination.pagination-sm >li:not(.page-nav)>a").last().attr("href");
    console.log(listLength)
    listChapter.each(function(index,element){
        // console.log( $(this).text());
        const nameChapter = $(this).text();
        const urlChapter = $(this).attr("href");
        Chapter.push({name:nameChapter,url:urlChapter});
    })
    console.log(Chapter.length);
    //console.log(data);
}
module.exports ={
    getListLinkInPage,
    getDetialComic
}