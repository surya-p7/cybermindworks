import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { JobApplication } from '../../job-applications/entities/job-application.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column()
  location: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  jobType: string;

  @Column({ nullable: true })
  salary: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ type: 'text', nullable: true })
  responsibilities: string;

  @Column({ type: 'date', nullable: true })
  deadline: Date;

  @Column({ default: 'active' }) // 'active', 'closed', 'draft'
  status: string;

  @Column({ name: 'posted_by_id' })
  postedById: string;

  @ManyToOne(() => User, (user) => user.postedJobs)
  @JoinColumn({ name: 'posted_by_id' })
  postedBy: User;

  @OneToMany(() => JobApplication, (application) => application.job)
  applications: JobApplication[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
