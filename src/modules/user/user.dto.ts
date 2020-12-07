import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Min } from "class-validator";

export class dtoRegisterUser{
    @ApiProperty({example:"test@gmail.com"})
    @IsEmail()
    email:string;
    @ApiProperty({minLength:6})
    @IsString()
    password:string;
}
export class dtoLoginUser{
    @ApiProperty({example:"test@gmail.com"})
    @IsEmail()
    email:string;
    @ApiProperty({minLength:6})
    @IsString()
    password:string;
}