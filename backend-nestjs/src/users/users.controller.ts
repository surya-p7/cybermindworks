import { Controller, Get, Patch, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile with applications and posted jobs' })
  async getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @Request() req,
    @Body() updateData: { fullName?: string; phone?: string; location?: string; bio?: string }
  ) {
    return this.usersService.updateProfile(req.user.userId, updateData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (public)' })
  async getUserById(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
