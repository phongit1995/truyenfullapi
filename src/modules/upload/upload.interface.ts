export interface fileUpload{
    fieldname:string,
    originalname:string,
    encoding:string,
    mimetype:string,
    fileName:string,
    fileId:string,
    
}
export interface fileUploadCloudinary {
    fieldname:string,
    originalname:string,
    encoding:string,
    mimetype:string,
    path:string,
    size:number
}