import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new job (requires authentication)' })
  create(@Body() createJobDto: CreateJobDto, @Request() req) {
    return this.jobsService.create(createJobDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all jobs' })
  findAll(@Query() query: any) {
    return this.jobsService.findAll();
  }

  @Get('my-jobs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get jobs posted by current user' })
  findMyJobs(@Request() req) {
    return this.jobsService.findByUser(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific job by ID' })
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a job (only by job poster)' })
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @Request() req) {
    return this.jobsService.update(id, updateJobDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a job (only by job poster)' })
  remove(@Param('id') id: string, @Request() req) {
    return this.jobsService.remove(id, req.user.userId);
  }
}
