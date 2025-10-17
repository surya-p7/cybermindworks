import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ example: 'Senior Frontend Developer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Tech Corp' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({ example: 'New York, USA' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 'We are looking for an experienced frontend developer...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Full-time', required: false })
  @IsString()
  @IsOptional()
  jobType?: string;

  @ApiProperty({ example: '$120,000 - $150,000', required: false })
  @IsString()
  @IsOptional()
  salary?: string;

  @ApiProperty({ example: '5+ years of React experience', required: false })
  @IsString()
  @IsOptional()
  requirements?: string;

  @ApiProperty({ example: 'Build and maintain web applications', required: false })
  @IsString()
  @IsOptional()
  responsibilities?: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsDateString()
  @IsOptional()
  deadline?: string;
}
