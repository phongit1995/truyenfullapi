import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";

export class dtoReportManga{
    @ApiProperty({description:"manga id"})
    @IsMongoId()
    manga_id:string ;
    @ApiProperty({description:"reason"})
    @IsString()
    @IsOptional()
    reason:string
}
export class dtoGetListReportManga{
    @ApiProperty({description:"page number",default:1})
    @IsNumber()
    page:number ;
    @ApiProperty({description:"reason",default:10})
    @IsNumber()
    @IsOptional()
    numberItem:number ;
}