import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiConsumes, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/common/api-result';
import { RoleType } from 'src/common/constants/role-type';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { dtoLoginUser, dtoRegisterUser ,dtoDevicesUser } from './user.dto';
import { UserService } from './user.service';
import { Roles } from 'src/common/decorators/role.decorators';
import { UserInfo } from 'src/common/decorators/user.decorators';
import { User } from 'src/database/user.model';
@ApiHeader({
    name: 'token',
    description: 'Token Of User'
})
@ApiTags("User")
@ApiConsumes("User Api")
@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
    constructor(private userService:UserService){}
    @Post("register-user")
    @ApiOperation({summary:"Register User"})
    @ApiResponse({ status: 200, description: 'Register User Success Fully.'})
    @UsePipes(new ValidationPipe({transform:true}))
    async createNewUser(@Body()dataRegister:dtoRegisterUser){
        const user = await this.userService.RegisterUser(dataRegister);
        return (new ApiResult().success(user))
    }
    @Post("login-user")
    @ApiOperation({summary:"Login User Success"})
    @ApiResponse({ status: 200, description: 'Login User Success Fully.'})
    @UsePipes(new ValidationPipe({transform:true}))
    async LoginUser(@Body()dataLogin:dtoLoginUser){
        const user = await this.userService.LoginUser(dataLogin);
        return (new ApiResult().success(user))
    }
    @Post("add-devices-user")
    @ApiOperation({summary:"Login User Success"})
    @ApiResponse({ status: 200, description: 'Login User Success Fully.'})
    @Roles(RoleType.USER)
    @UsePipes(new ValidationPipe({transform:true}))
    async addDevicesUser(@Body()dataDevices:dtoDevicesUser,@UserInfo()user:User){
        await this.userService.addDevicesUser(user._id,dataDevices.devices);
        return (new ApiResult().success())
    }
}
