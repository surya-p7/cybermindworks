import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      relations: ['applications', 'applications.job', 'postedJobs'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Remove password from response
    const { password, ...result } = user;
    return result as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async updateProfile(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Don't allow updating email or password through this method
    const { email, password, ...allowedUpdates } = updateData as any;
    
    Object.assign(user, allowedUpdates);
    const updated = await this.usersRepository.save(user);
    
    const { password: pwd, ...result } = updated;
    return result as User;
  }
}
