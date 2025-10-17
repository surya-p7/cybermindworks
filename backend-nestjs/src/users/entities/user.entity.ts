import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Job } from '../../jobs/entities/job.entity';
import { JobApplication } from '../../job-applications/entities/job-application.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({ default: 'jobseeker' }) // 'jobseeker' or 'employer'
  role: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @OneToMany(() => Job, (job) => job.postedBy)
  postedJobs: Job[];

  @OneToMany(() => JobApplication, (application) => application.applicant)
  applications: JobApplication[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
