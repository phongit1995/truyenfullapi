import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chapter } from 'src/database/chapter.model';
import { Manga } from 'src/database/manga.model';
import { FcmPushService } from 'src/shared/services/push.service';

@Injectable()
export class NotificationService {
    constructor(
        private readonly fcmPushService:FcmPushService,
        @InjectModel("manga") private readonly mangaModel:Model<Manga>,
        @InjectModel("chapter") private readonly chapterModel:Model<Chapter>
    ){}
    async testPushNotification(devices:string[]){
        return this.fcmPushService.sendMessage({
            registration_ids:devices,
            notification:{
                title:"Hello",
                body:"22222"
            }
        })
    }
}
