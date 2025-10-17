import { Controller, Post, Get, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JobApplicationsService } from './job-applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('applications')
@Controller('applications')
export class JobApplicationsController {
  constructor(private readonly jobApplicationsService: JobApplicationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply to a job (requires authentication)' })
  async create(
    @Body() createApplicationDto: { jobId: string; coverLetter: string; resume?: string },
    @Request() req
  ) {
    return this.jobApplicationsService.applyToJob(
      createApplicationDto.jobId,
      req.user.userId,
      createApplicationDto.coverLetter,
      createApplicationDto.resume,
    );
  }

  @Get('job/:jobId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all applications for a job (only by job poster)' })
  async getJobApplications(@Param('jobId') jobId: string, @Request() req) {
    return this.jobApplicationsService.getJobApplications(jobId, req.user.userId);
  }

  @Get('my-applications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user applications' })
  async getUserApplications(@Request() req) {
    return this.jobApplicationsService.getUserApplications(req.user.userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update application status (only by job poster)' })
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: { status: string },
    @Request() req
  ) {
    return this.jobApplicationsService.updateApplicationStatus(id, updateStatusDto.status, req.user.userId);
  }
}
