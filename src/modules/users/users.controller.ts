import { Controller, Get, Param, Delete, UseGuards, Body, Req, Put, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from './entities/userRole.enum';
import { InterestsService } from '../interests/interests.service';
import { AssignInterestsDto } from '../interests/dto/assign-interests.dto';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly interestsService: InterestsService,
  ) {
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Retrieve the list of all users.' })
  @ApiResponse({ status: 200, description: 'Users list retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admin can retrieve the list of users.' })
  async findAll() {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID', description: 'Retrieve a user details by their ID.' })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'User identifier' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only the owner can retrieve their details.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user', description: 'Update a user information by ID.' })
  @ApiParam({ name: 'updateUserDto', type: UpdateUserDto, description: 'User update payload' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only the owner can update their information.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: any,
  ) {
    return await this.usersService.update(+id, updateUserDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user', description: 'Delete a user by ID.' })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'User identifier' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admin can delete users.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('id') id: string, @Req() req: any) {
    return await this.usersService.remove(+id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('interests')
  @ApiOperation({
    summary: 'Assign interests to the current user',
    description: 'Associate multiple interests with the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'Interests assigned successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User or interests not found.' })
  async assignInterests(@Body() assignInterestsDto: AssignInterestsDto, @Req() req: any,
  ) {
    return await this.interestsService.assignToUser(req.user.id, assignInterestsDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('interests')
  @ApiOperation({
    summary: 'Get user interests',
    description: 'Retrieve the list of interests associated with the current user.',
  })
  @ApiResponse({ status: 200, description: 'Interests retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUserInterests(@Req() req: any) {
    return await this.interestsService.getUserInterests(req.user.id, req.user);
  }
}
