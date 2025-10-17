import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplicationsService } from './job-applications.service';
import { JobApplicationsController } from './job-applications.controller';
import { JobApplication } from './entities/job-application.entity';
import { Job } from '../jobs/entities/job.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplication, Job]),
    UsersModule,
  ],
  controllers: [JobApplicationsController],
  providers: [JobApplicationsService],
  exports: [JobApplicationsService],
})
export class JobApplicationsModule {}
