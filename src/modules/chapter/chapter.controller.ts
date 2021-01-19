import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/common/api-result';
import { dtoGetListChapter ,dtoGetDetialChapter, dtoDeleteContentChapter } from './chapter.dto';
import { ChapterService } from './chapter.service';
@ApiTags("chapter")
@ApiConsumes("chapter Api")
@Controller('chapter')
export class ChapterController {
    constructor(private chapterService:ChapterService){}
    @Post("list-chapter")
    @ApiOperation({summary:"Get List Chapter of Manga"})
    @ApiResponse({ status: 200, description: 'Get List Chapter Success Fully.'})
    @UsePipes(new ValidationPipe())
    async getListChapter(@Body()dataGet:dtoGetListChapter){
        const [listChapter,totalChapter] = await Promise.all([
            this.chapterService.getListChapterManga(dataGet.manga_id,dataGet.page,dataGet.numberItem),
            this.chapterService.totalNumberChapter(dataGet.manga_id)
        ])
        return (new ApiResult().success(listChapter,totalChapter))
    }
    @Post("detial-chapter")
    @ApiOperation({summary:"Get Detial Chapter"})
    @ApiResponse({ status: 200, description: 'Get Detial Chapter Success Fully.'})
    @UsePipes(new ValidationPipe())
    async getDetialListChapter(@Body()dataGet:dtoGetDetialChapter){
       const chapter = await this.chapterService.getDetialChapter(dataGet.id);
       return (new ApiResult().success(chapter))
    }
    @Post("delete-content-chapter")
    @ApiOperation({summary:"Delete Content Text Chapter . For Admin User"})
    @ApiResponse({ status: 200, description: 'Get Detial Chapter Success Fully. '})
    @UsePipes(new ValidationPipe())
    async deleteContentChapter(@Body()dataGet:dtoDeleteContentChapter){
       const chapter = await this.chapterService.deleteContentChapter(dataGet.id);
       return (new ApiResult().success(chapter))
    }
}
