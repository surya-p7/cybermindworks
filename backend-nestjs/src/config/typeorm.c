import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { JobApplication } from '../job-applications/entities/job-application.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'jobportal',
  entities: [User, Job, JobApplication],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // always false for production!
  logging: true,
});
export default AppDataSource;