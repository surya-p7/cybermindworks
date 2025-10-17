import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto, userId: string): Promise<Job> {
    const job = this.jobsRepository.create({ 
      ...createJobDto,
      postedById: userId,
    });
    return this.jobsRepository.save(job);
  }

  async findAll(): Promise<Job[]> {
    return this.jobsRepository.find({
      relations: ['postedBy', 'applications'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobsRepository.findOne({ 
      where: { id },
      relations: ['postedBy', 'applications', 'applications.applicant'],
    });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return job;
  }

  async findByUser(userId: string): Promise<Job[]> {
    return this.jobsRepository.find({
      where: { postedById: userId },
      relations: ['applications'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateJobDto: UpdateJobDto, userId: string): Promise<Job> {
    const job = await this.jobsRepository.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    
    // Only the job poster can update the job
    if (job.postedById !== userId) {
      throw new ForbiddenException('You can only update your own job postings');
    }
    
    return this.jobsRepository.save({ ...job, ...updateJobDto });
  }

  async remove(id: string, userId: string): Promise<void> {
    const job = await this.jobsRepository.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    
    // Only the job poster can delete the job
    if (job.postedById !== userId) {
      throw new ForbiddenException('You can only delete your own job postings');
    }
    
    await this.jobsRepository.remove(job);
  }
}
