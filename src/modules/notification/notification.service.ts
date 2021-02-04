import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NOTIFiCATION_TYPE } from 'src/common/constants/notification.type';
import { Chapter } from 'src/database/chapter.model';
import { Comment } from 'src/database/comment.model';
import { Manga } from 'src/database/manga.model';
import { User } from 'src/database/user.model';
import { FcmPushService } from 'src/shared/services/push.service';

@Injectable()
export class NotificationService {
    constructor(
        private readonly fcmPushService:FcmPushService,
        @InjectModel("manga") private readonly mangaModel:Model<Manga>,
        @InjectModel("chapter") private readonly chapterModel:Model<Chapter>,
        @InjectModel("comment") private readonly commentModel:Model<Comment>,
        @InjectModel("user") private readonly userModel:Model<User>,
    ){}
    async testPushNotification(devices:string[]){
        return this.fcmPushService.sendMessage({
            registration_ids:devices,
            notification:{
                title:"Hello",
                body:"22222",
                image:"https://static.8cache.com/cover/eJwFwcm2a0oAANAvsp6UrgzegOiFKH1MLEKOnkq09fV376Fh_luRKEHtrcbbR_KEIhl91-YzKx1KaJZJPg6JJK8ffWfJkkxN1obJ3zfv8c9HXza1cIPysk8N_1EYwcSvVpwGMFp7X2S09FZVsnwxl-ztGQ3eJwcDqGbtTDFTAfsYzZ78N3bWizo2gXlpbzkqzAMWn0eYoY-bnkkMVdTUwy1-WYmNJ0ki8A4mpRSamkwRyunvNAjHtYyhLVd7cMedb2mNQpfCVQeVzFuxPzmjE4VImdcFJva0ARElF-f4q1xWxH92_REKzg0ryAJqC04-JX1vOsD78bxV5As532uwZdPVDRKocSPRbpJ2ovxbWbIrm4HTgXXKTzHv7ohNJb2ef2XlnP2K1ijhcd7PHvsgnDQrh66a7H3rNHY60Rw88ZF4IRSK5oXqbMpi7RmiVVx26VbXEWCxR-hhM6Czb0U08Hxx_5ZUrQPWqjiwZSikWkrVsS37TqB7MRQ8IRPn74j0tzsGrpjo8BXbHshMipIN2hUXLDV6cwPX1h_mc7JoSc3Pw3wMD_HMZvFhecYJMXnClh00MgaWnJstEH6v8dRSwuzekmg_cei61p2rsXTuARBNwtmQzBkHQe61uolaw2WIPztsuTLKb6_YTvz_uPEs1QCW-wddONCp/dai-boss-tre-con-cuc-ky-yeu-vo.jpg"
            },
            apns:{
                fcm_options:{
                    image:"https://static.8cache.com/cover/eJwFwcm2a0oAANAvsp6UrgzegOiFKH1MLEKOnkq09fV376Fh_luRKEHtrcbbR_KEIhl91-YzKx1KaJZJPg6JJK8ffWfJkkxN1obJ3zfv8c9HXza1cIPysk8N_1EYwcSvVpwGMFp7X2S09FZVsnwxl-ztGQ3eJwcDqGbtTDFTAfsYzZ78N3bWizo2gXlpbzkqzAMWn0eYoY-bnkkMVdTUwy1-WYmNJ0ki8A4mpRSamkwRyunvNAjHtYyhLVd7cMedb2mNQpfCVQeVzFuxPzmjE4VImdcFJva0ARElF-f4q1xWxH92_REKzg0ryAJqC04-JX1vOsD78bxV5As532uwZdPVDRKocSPRbpJ2ovxbWbIrm4HTgXXKTzHv7ohNJb2ef2XlnP2K1ijhcd7PHvsgnDQrh66a7H3rNHY60Rw88ZF4IRSK5oXqbMpi7RmiVVx26VbXEWCxR-hhM6Czb0U08Hxx_5ZUrQPWqjiwZSikWkrVsS37TqB7MRQ8IRPn74j0tzsGrpjo8BXbHshMipIN2hUXLDV6cwPX1h_mc7JoSc3Pw3wMD_HMZvFhecYJMXnClh00MgaWnJstEH6v8dRSwuzekmg_cei61p2rsXTuARBNwtmQzBkHQe61uolaw2WIPztsuTLKb6_YTvz_uPEs1QCW-wddONCp/dai-boss-tre-con-cuc-ky-yeu-vo.jpg"
                }
            }
        })
    }
    async sendNotificationUpdateChapterManga(manga_id:string){
        const mangaData = await this.mangaModel.findById(manga_id);
        if(!mangaData){
            return ;
        }
        if(mangaData.devices.length==0){
            return ;
        }
        this.fcmPushService.sendMessage({
            registration_ids:mangaData.devices,
            notification:{
                title:"Cập Nhật",
                body:` ${mangaData.name} đã có chapter mới kìa !!!`,
                image:mangaData.image
            },
            data:{
                type:NOTIFiCATION_TYPE.MANGA_NEW_CHAPTER,
                id:manga_id
            },
            apns:{
                fcm_options:{
                    image:mangaData.image
                }
            }
        })
    }
    // Notification user When Comment To Manga
    async sendNotificationWhenCommentManga(user_id:string,manga_id:string,manga_name:string,date_comment:Date){
        const dateFetch:Date = new Date(date_comment.getTime()-1000*60*60*12);
        const listCommentLate = await this.commentModel.find({
            manga:manga_id,
            user:{$ne:user_id},
            createdAt:{$gt:dateFetch}
        })
        const listUser = listCommentLate.map((comment)=>comment.user);
        let listDevices=await this.getListDevicesOfUser(listUser);
         if(listDevices.length==0){
             return ;
         }
         const user = await this.userModel.findById(user_id);
         this.fcmPushService.sendMessage({
             registration_ids:listDevices,
             notification:{
                 title:"👉 👉 Bình Luận 👈👈",
                 body:` ❤️💖 ${user.name} cũng đã bình luận vào truyện ${manga_name}`
             },
             data:{
                type:NOTIFiCATION_TYPE.COMMENT_TO_MANGA,
                id:manga_id
            },
         })
    }
    // get List Devices Of List User
    private async getListDevicesOfUser(listUser:string[]):Promise<string[]>{
        const listUserData = await this.userModel.find({
            _id:{
                $in:listUser
            }
        })
        let listDevices:string[]=[];
        listUserData.forEach((user)=>listDevices=listDevices.concat(user.devices));
        return listDevices;
    }
}
