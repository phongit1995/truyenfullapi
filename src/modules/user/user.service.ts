import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ERROR_TYPE } from 'src/common/constants/error';
import { User } from 'src/database/user.model';
import { dtoLoginUser, dtoRegisterUser } from './user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel('user')private mangaModel:Model<User>){}
    async RegisterUser(user:dtoRegisterUser):Promise<User>{
        let userData = await this.mangaModel.findOne({email:user.email.toLowerCase()});
        if(userData){
            throw new HttpException(ERROR_TYPE.EMAIL_IS_EXITS,HttpStatus.BAD_REQUEST);
        }
        return this.mangaModel.create({email:user.email.toLowerCase(),password:user.password});
    }
    async LoginUser(userData:dtoLoginUser):Promise<User>{
        const user = await this.mangaModel.findOne({email:userData.email.toLowerCase(),password:userData.password}).select("-password");
        if(user){
            return user;
        }
        throw new HttpException(ERROR_TYPE.EMAIL_OR_PASSWORD_IS_CORRECT,HttpStatus.BAD_REQUEST);
    }
}
