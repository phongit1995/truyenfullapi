import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { ApiResult } from 'src/common/api-result';
import { storageDrive } from 'src/common/google/storage.google';
import {storageCloudinary} from 'src/common/cloudinary';
import { fileUpload, fileUploadCloudinary } from './upload.interface';

@Controller('upload')
export class UploadController {
    @Post("/")
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file',{
        storage:storageCloudinary,
        limits:{
            fieldSize:1000
        }
    }))
    uploadFile(@UploadedFile()file:fileUploadCloudinary){
        return (new ApiResult().success(file.path))
    }

}
