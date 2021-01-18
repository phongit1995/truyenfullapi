import { Module } from '@nestjs/common';
import { VersionService } from './version.service';
import { VersionController } from './version.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { versionSchema } from 'src/database/version.model';

@Module({
  imports:[
    MongooseModule.forFeature([{name:"version",schema:versionSchema}])
  ],
  providers: [VersionService],
  controllers: [VersionController]
})
export class VersionModule {}
