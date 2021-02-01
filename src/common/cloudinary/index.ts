import {v2 as cloudinary} from 'cloudinary';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
cloudinary.config({
    cloud_name:"truyenfull",
    api_key:"389864556765286",
    api_secret:"FgYs6aZ_x7l0V4gjv36ZgLhSIkE"
})
export const storageCloudinary = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"avatar"
    }
})
