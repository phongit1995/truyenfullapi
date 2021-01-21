import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiConsumes, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/common/api-result';
import { RoleType } from 'src/common/constants/role-type';
import { Roles } from 'src/common/decorators/role.decorators';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { dtoCreateNewVersion, dtoGetListVersion } from './version.dto';
import { VersionService } from './version.service';
@ApiHeader({
    name: 'token',
    description: 'Token Of User'
})
@ApiHeader({
    name: 'admin',
    description: 'admin key',
    example:"ADMIN"
})
@ApiTags("Version")
@ApiConsumes("Version Api")
@UseGuards(RolesGuard)
@Controller('version')
export class VersionController {
    constructor(private versionService:VersionService){}
    @Post("create-new")
    @Roles(RoleType.MEMBER)
    @ApiOperation({summary:"Create New Version"})
    @ApiResponse({ status: 200, description: 'Create New Version Success Full.'})
    @UsePipes(new ValidationPipe())
    async createNewVersion(@Body()dataCreate:dtoCreateNewVersion){
        const result = await this.versionService.createNewVersion(dataCreate.name,dataCreate.version_type,dataCreate.support);
        return (new ApiResult().success(result))
    }
    @Post("get-list")
    @Roles(RoleType.MEMBER)
    @ApiOperation({summary:"Get List Version"})
    @ApiResponse({ status: 200, description: 'Get List Version Success Full.'})
    @UsePipes(new ValidationPipe())
    async getListVersion(@Body()dataGetList:dtoGetListVersion){
        const listVersion  = await this.versionService.getListVersion(dataGetList.version_type);
        return (new ApiResult().success(listVersion))
    }
}
