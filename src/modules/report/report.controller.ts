import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiConsumes, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/common/api-result';
import { RoleType } from 'src/common/constants/role-type';
import { Roles } from 'src/common/decorators/role.decorators';
import { UserInfo } from 'src/common/decorators/user.decorators';
import { User } from 'src/database/user.model';
import { dtoGetListReportManga, dtoReportManga } from './report.dto';
import { ReportService } from './report.service';
@ApiHeader({
    name: 'token',
    description: 'Token Of User'
})
@ApiHeader({
    name: 'admin',
    description: 'admin key',
    example:"ADMIN"
})
@ApiTags("Report")
@ApiConsumes("Report Api")
@Controller('report')
export class ReportController {
    constructor(private reportService:ReportService){}
    @Post("report-manga")
    @ApiOperation({summary:"Comment To Manga"})
    @ApiResponse({ status: 200, description: 'Comment Success Full.'})
    @Roles(RoleType.USER)
    @UsePipes(new ValidationPipe())
    async createNewReportManga(@Body()dataReport:dtoReportManga,@UserInfo()user:User){
        const resultReport= await this.reportService.createNewMangaReport(dataReport.manga_id,dataReport.reason,user?._id);
        return (new ApiResult().success(resultReport))
    }
    @Post("list-report-manga")
    @ApiOperation({summary:"Get List Report Manga"})
    @ApiResponse({ status: 200, description: 'Get List Report Manga Success Full.'})
    async getListReportManga(@Body()dataReport:dtoGetListReportManga){
        const listReportManga = await this.reportService.getListMangaReport(dataReport.page,dataReport.numberItem);
        return (new ApiResult().success(listReportManga))
    }
}
