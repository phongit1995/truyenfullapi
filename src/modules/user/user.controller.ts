import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/common/api-result';
import { dtoLoginUser, dtoRegisterUser } from './user.dto';
import { UserService } from './user.service';
@ApiTags("User")
@ApiConsumes("User Api")
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
}
