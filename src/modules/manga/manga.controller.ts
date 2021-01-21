import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/common/api-result';
import { RoleType } from 'src/common/constants/role-type';
import { Roles } from 'src/common/decorators/role.decorators';
import { UserInfo } from 'src/common/decorators/user.decorators';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { User } from 'src/database/user.model';
import { dtoAddDeviceManga, dtoGetDetialManga, dtoGetListManga, dtoGetListMangaByCategory, dtoHiddenManga, dtoRemoveDeviceManga, dtoSearchManga, dtoSuggestManga, dtoUserFollowManga, dtoUserUnFollowManga } from './manga.dto';
import { MangaService } from './manga.service';

@ApiTags("manga")
@ApiConsumes("Manga Api")
@Controller('manga')
@UseGuards(RolesGuard)
export class MangaController {
    constructor(
        private mangaService:MangaService
    ){}
    @Post("get-list")
    @ApiOperation({summary:"Get List Of Manga"})
    @ApiResponse({ status: 200, description: 'Get List Chapter Success Fully.'})
    @UsePipes(new ValidationPipe({transform:true}))
    async getListManga(@Body()dataGet:dtoGetListManga){
        const listManga = await this.mangaService.getListManga(dataGet);
        return (new ApiResult().success(listManga))
    }
    @Post("detial-manga")
    @ApiOperation({summary:"Get Detial Manga Buy Id"})
    @ApiResponse({ status: 200, description: 'Hidden Manga Success Fully.'})
    @UsePipes(new ValidationPipe({transform:true}))
    async getDetialManga(@Body()dataGet:dtoGetDetialManga){
        const Manga = await this.mangaService.getDetialMangaById(dataGet.manga_id);
        return (new ApiResult().success(Manga))
    }
    @Post("get-list-category")
    @ApiOperation({summary:"Get List Of Manga By Category"})
    @ApiResponse({ status: 200, description: 'Get List Chapter Success Fully.'})
    @UsePipes(new ValidationPipe({transform:true}))
    async getListMangaByCategory(@Body()dataGet:dtoGetListMangaByCategory){
        const listManga = await this.mangaService.getListMangaByCategory(dataGet);
        return (new ApiResult().success(listManga))
    }
    @Post("search-manga")
    @ApiOperation({summary:"Search Manga By Name"})
    @ApiResponse({ status: 200, description: 'Get List Chapter Success Fully.'})
    @UsePipes(new ValidationPipe({transform:true}))
    async searchManga(@Body()dataGet:dtoSearchManga){
        const listManga = await this.mangaService.SearchMangaByName(dataGet);
        return (new ApiResult().success(listManga))
    }
    @Post("hidden-manga")
    @ApiOperation({summary:"Hidden Manga By Name"})
    @ApiResponse({ status: 200, description: 'Hidden Manga Success Fully.'})
    @UsePipes(new ValidationPipe({transform:true}))
    async hiddenManga(@Body()dataHidden:dtoHiddenManga){
        let resultGame = await this.mangaService.HiddenManga(dataHidden.manga_id);
        return (new ApiResult().success())
    }
    @Post("follow-manga")
    @ApiOperation({summary:"Add Devices When Follow Manga. User Not Login "})
    @ApiResponse({ status: 200, description: 'Add Device Success Fully.'})
    @UsePipes(new ValidationPipe({transform:true}))
    async addDevicesToManga(@Body()dataAdd:dtoAddDeviceManga){
        await this.mangaService.addDevicesToManga(dataAdd.manga_id,dataAdd.device);
        return (new ApiResult().success())
    }
    @Post("un-follow-manga")
    @ApiOperation({summary:"Remove Devices When UnFollow Manga "})
    @ApiResponse({ status: 200, description: 'Remove Device Success Fully.'})
    @UsePipes(new ValidationPipe({transform:true}))
    async removeDevicesToManga(@Body()dataAdd:dtoRemoveDeviceManga){
        await this.mangaService.removeDevicesToManga(dataAdd.manga_id,dataAdd.device);
        return (new ApiResult().success())
    }
    @Post("user-follow-manga")
    @ApiOperation({summary:"User follow Manga. User Is Login "})
    @ApiResponse({ status: 200, description: 'User follow Manga Success Fully.'})
    @UsePipes(new ValidationPipe({transform:true}))
    @Roles(RoleType.USER)
    async userFollowManga(@UserInfo()user:User,@Body()data:dtoUserFollowManga){
        await this.mangaService.addUserFollowManga(user._id,data.manga_id);
        return (new ApiResult().success())
    }
    @Post("user-un-follow-manga")
    @ApiOperation({summary:"User Un follow Manga. User Is Login "})
    @ApiResponse({ status: 200, description: 'User  Un follow Manga Success Fully.'})
    @UsePipes(new ValidationPipe({transform:true}))
    @Roles(RoleType.USER)
    async userUnFollowManga(@UserInfo()user:User,@Body()data:dtoUserUnFollowManga){
        await this.mangaService.userUnFollowManga(data.manga_id,user._id);
        return (new ApiResult().success())
    }
    @Post("suggest-manga")
    @ApiOperation({summary:"List Suggest Manga"})
    @ApiResponse({ status: 200, description: 'List Suggest Manga Success Fully.'})
    @UsePipes(new ValidationPipe({transform:true}))
    async suggestToManga(@Body()dataSuggest:dtoSuggestManga){
        const listSuggest= await this.mangaService.listSuggestManga(dataSuggest.category,dataSuggest.page,dataSuggest.numberItem);
        return (new ApiResult().success(listSuggest))
    }
}
