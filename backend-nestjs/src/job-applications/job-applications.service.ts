import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplication } from './entities/job-application.entity';
import { Job } from '../jobs/entities/job.entity';

@Injectable()
export class JobApplicationsService {
  constructor(
    @InjectRepository(JobApplication)
    private jobApplicationsRepository: Repository<JobApplication>,
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
  ) {}

  async applyToJob(jobId: string, applicantId: string, coverLetter: string, resume?: string): Promise<JobApplication> {
    // Check if job exists
    const job = await this.jobsRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Check if user already applied
    const existingApplication = await this.jobApplicationsRepository.findOne({
      where: { jobId, applicantId },
    });

    if (existingApplication) {
      throw new ConflictException('You have already applied to this job');
    }

    // Create application
    const application = this.jobApplicationsRepository.create({ 
      jobId, 
      applicantId,
      coverLetter,
      resume,
    });
    
    return this.jobApplicationsRepository.save(application);
  }

  async getJobApplications(jobId: string, userId: string): Promise<JobApplication[]> {
    // Verify the user is the job poster
    const job = await this.jobsRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.postedById !== userId) {
      throw new ForbiddenException('You can only view applications for your own job postings');
    }

    return this.jobApplicationsRepository.find({ 
      where: { jobId },
      relations: ['applicant', 'job'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUserApplications(userId: string): Promise<JobApplication[]> {
    return this.jobApplicationsRepository.find({
      where: { applicantId: userId },
      relations: ['job', 'job.postedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateApplicationStatus(applicationId: string, status: string, userId: string): Promise<JobApplication> {
    const application = await this.jobApplicationsRepository.findOne({ 
      where: { id: applicationId },
      relations: ['job'],
    });
    
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Only the job poster can update application status
    if (application.job.postedById !== userId) {
      throw new ForbiddenException('You can only update applications for your own job postings');
    }

    application.status = status;
    return this.jobApplicationsRepository.save(application);
  }
}
