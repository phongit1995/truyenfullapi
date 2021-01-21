import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiConsumes, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/common/api-result';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { dtoTestNotification } from './notification.dto';
import { NotificationService } from './notification.service';
@ApiHeader({
    name: 'token',
    description: 'Token Of User'
})
@ApiTags("Notification")
@ApiConsumes("Notification Api")
@UseGuards(RolesGuard)
@Controller('notification')
export class NotificationController {
    constructor(private notificationService:NotificationService){}
    @Post("test-push-notification")
    @ApiOperation({summary:"Test Notification"})
    @ApiResponse({ status: 200, description: 'Test Notification Success Fully.'})
    @UsePipes(new ValidationPipe({transform:true}))
    async testNotification(@Body()data:dtoTestNotification){
        const result = await this.notificationService.testPushNotification([data.devices]);
        return (new ApiResult().success(result))
    }
}
