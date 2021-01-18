import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { VERSION_TYPE } from "src/database/version.model";

export class dtoCreateNewVersion {
    @ApiProperty({description:"Version Type",default:VERSION_TYPE.ANDROID})
    @IsOptional()
    @IsString()
    @IsEnum(VERSION_TYPE)
    version_type:string=VERSION_TYPE.ANDROID;
    @ApiProperty({description:"Name Of Version"})
    @IsString()
    name:string;
    @ApiProperty({description:"support version",default:true})
    @IsBoolean()
    @IsOptional()
    support:boolean=true;
}
export class dtoGetListVersion{
    @ApiProperty({description:"Version Type",default:VERSION_TYPE.ANDROID})
    @IsString()
    @IsEnum(VERSION_TYPE)
    version_type:string=VERSION_TYPE.ANDROID;
}