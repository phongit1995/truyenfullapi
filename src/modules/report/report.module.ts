import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { reportSchema } from 'src/database/report.model';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:"report",schema:reportSchema}
    ])
  ],
  providers: [ReportService],
  controllers: [ReportController]
})
export class ReportModule {}
