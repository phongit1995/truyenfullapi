import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class dtoTestNotification{
    @ApiProperty({description:"Devices User"})
    @IsString()
    devices:string
}