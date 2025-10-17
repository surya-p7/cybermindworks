import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
      role: registerDto.role || 'jobseeker',
    });

    const savedUser = await this.usersRepository.save(user);

    // Generate JWT token
    const payload = { sub: savedUser.id, email: savedUser.email, role: savedUser.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        fullName: savedUser.fullName,
        role: savedUser.role,
        phone: savedUser.phone,
        location: savedUser.location,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // Find user
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
      },
    };
  }

  async validateUser(userId: string) {
    return this.usersRepository.findOne({ where: { id: userId } });
  }
}
