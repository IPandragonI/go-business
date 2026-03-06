import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../users/entities/userRole.enum';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an interest', description: 'Create a new interest' })
  @ApiResponse({ status: 201, description: 'Interest created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can create interests.' })
  @ApiBody({ type: CreateInterestDto })
  create(@Body() createInterestDto: CreateInterestDto, @Req() req: any) {
    return this.interestsService.create(createInterestDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all interests', description: 'Retrieve the list of all available interests' })
  @ApiResponse({ status: 200, description: 'Interests list retrieved successfully.' })
  findAll() {
    return this.interestsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an interest by ID', description: 'Retrieve an interest by its ID' })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'Interest identifier' })
  @ApiResponse({ status: 200, description: 'Interest retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Interest not found.' })
  findOne(@Param('id') id: string) {
    return this.interestsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an interest', description: 'Update an interest' })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'Interest identifier' })
  @ApiBody({ type: UpdateInterestDto })
  @ApiResponse({ status: 200, description: 'Interest updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can update interests.' })
  @ApiResponse({ status: 404, description: 'Interest not found.' })
  update(@Param('id') id: string, @Body() updateInterestDto: UpdateInterestDto, @Req() req: any) {
    return this.interestsService.update(+id, updateInterestDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an interest', description: 'Delete an interest' })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'Interest identifier' })
  @ApiResponse({ status: 200, description: 'Interest deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can delete interests.' })
  @ApiResponse({ status: 404, description: 'Interest not found.' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.interestsService.remove(+id, req.user);
  }
}

