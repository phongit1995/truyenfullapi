import { Controller } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
@ApiTags("Comment")
@ApiConsumes("Comment Api")
@Controller('comment')
export class CommentController {
    constructor(private commentService:CommentService){}
    
}
