import { Module } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MangaController } from './manga.controller';
import { mangaSchema } from 'src/database/manga.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[
    MongooseModule.forFeature([{name:"manga",schema:mangaSchema}]),
  ],
  providers: [MangaService],
  controllers: [MangaController],
  exports:[MangaService]
})
export class MangaModule {}
