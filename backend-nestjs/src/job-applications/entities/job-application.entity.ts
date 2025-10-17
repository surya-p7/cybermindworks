import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Job } from '../../jobs/entities/job.entity';

@Entity('job_applications')
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'job_id' })
  jobId: string;

  @ManyToOne(() => Job, (job) => job.applications)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column({ name: 'applicant_id' })
  applicantId: string;

  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn({ name: 'applicant_id' })
  applicant: User;

  @Column({ type: 'text' })
  coverLetter: string;

  @Column({ nullable: true })
  resume: string; // URL or path to resume file

  @Column({ default: 'pending' }) // 'pending', 'reviewed', 'accepted', 'rejected'
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
