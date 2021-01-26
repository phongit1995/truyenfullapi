import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsString } from "class-validator";

export class dtoTestNotification{
    @ApiProperty({description:"Devices User"})
    @IsString()
    devices:string
}
export class dtoTestNotificationUpdateManga{
    @ApiProperty({description:"Manga Id"})
    @IsMongoId()
    manga_id:string
}