import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ConfigServer } from 'src/shared/services/config.service';
@Injectable()
export class RequestCheckMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService){}
    async use(req: Request|any, res: Response, next: Function){
        const token =  req.headers?.token ;
        if(token){
            try {
                let user= this.jwtService.decode(token);
                req.user=user ;
            } catch (error) {
                console.log('loi' +error);
            }
        }  
        next();
    }
}

