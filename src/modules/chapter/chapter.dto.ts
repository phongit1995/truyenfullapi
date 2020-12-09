import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNumber, IsOptional, Min } from "class-validator";

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
    numberItem:number=100
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