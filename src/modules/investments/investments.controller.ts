import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../users/entities/userRole.enum';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INVESTOR)
  @Post()
  @ApiOperation({ summary: 'Create an investment', description: 'Invest in a project (investors only).' })
  @ApiResponse({ status: 201, description: 'Investment created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only investors can make investments.' })
  @ApiResponse({ status: 404, description: 'Investor or project not found.' })
  @ApiBody({ type: CreateInvestmentDto })
  create(@Body() createInvestmentDto: CreateInvestmentDto, @Req() req: any) {
    return this.investmentsService.create(createInvestmentDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('all')
  @ApiOperation({
    summary: 'Get all investments (admin only)',
    description: 'Retrieve a list of all investments (admin only).',
  })
  @ApiResponse({ status: 200, description: 'Investments list retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can access this endpoint.' })
  findAll() {
    return this.investmentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get current user investments',
    description: 'Retrieve the list of investments made by the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'Investments list retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findByInvestor(@Req() req: any) {
    return this.investmentsService.findByInvestor(req.user.id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('project/:projectId')
  @ApiOperation({
    summary: 'Get project investments',
    description: 'Retrieve all investments for a specific project (project owner or admin only).',
  })
  @ApiParam({ name: 'projectId', type: 'number', example: 1, description: 'Project identifier' })
  @ApiResponse({ status: 200, description: 'Project investments retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. You are not the owner of this project.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  findByProject(@Param('projectId') projectId: string, @Req() req: any) {
    return this.investmentsService.findByProject(+projectId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('project/:projectId/stats')
  @ApiOperation({
    summary: 'Get project investment statistics',
    description: 'Retrieve investment statistics for a project (total funded, investor count).',
  })
  @ApiParam({ name: 'projectId', type: 'number', example: 1, description: 'Project identifier' })
  @ApiResponse({ status: 200, description: 'Project statistics retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  getProjectStats(@Param('projectId') projectId: string) {
    return this.investmentsService.getProjectStats(+projectId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INVESTOR)
  @Delete(':id')
  @ApiOperation({ summary: 'Cancel an investment', description: 'Cancel an investment (investor only).' })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'Investment identifier' })
  @ApiResponse({ status: 200, description: 'Investment cancelled successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. You can only cancel your own investments.' })
  @ApiResponse({ status: 404, description: 'Investment not found.' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.investmentsService.remove(+id, req.user);
  }
}

