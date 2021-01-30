import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, isEnum, IsMongoId, IsNumber, IsOptional, Min } from "class-validator";

export class dtoGetListChapter {
    @ApiProperty({title:"id of manga"})
    @IsMongoId()
    manga_id:string;
    @ApiProperty({minimum:1,example:1})
    @IsNumber()
    @Min(1)
    page:number=1;
    @ApiProperty({minimum:1,example:100})
    @IsNumber()
    @IsOptional()
    @Min(1)
    numberItem:number=100;
    @ApiProperty({title:"Sort Type" ,description:"1 la chapter tang dan. -1 la chapter giam dan",default:1})
    @IsEnum([1,-1])
    @IsNumber()
    @IsOptional()
    sort:number=1;
}
export class dtoGetDetialChapter {
    @ApiProperty({title:"id of chapter"})
    @IsMongoId()
    id:string;
}
export class dtoDeleteContentChapter {
    @ApiProperty({title:"id of chapter"})
    @IsMongoId()
    id:string;
}