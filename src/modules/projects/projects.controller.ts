import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put} from '@nestjs/common';
import {ProjectsService} from './projects.service';
import {CreateProjectDto} from './dto/create-project.dto';
import {UpdateProjectDto} from './dto/update-project.dto';
import {JwtAuthGuard} from '../../auth/guards/jwt-auth.guard';
import {Roles} from '../../auth/decorators/roles.decorator';
import {RolesGuard} from '../../auth/guards/roles.guard';
import {UserRole} from '../users/entities/userRole.enum';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody} from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.CONTRACTOR)
    @Post()
    @ApiOperation({summary: 'Create a project', description: 'Create a new project (only contractors).'})
    @ApiResponse({status: 201, description: 'Project created successfully.'})
    @ApiResponse({status: 403, description: 'Forbidden. Only contractors can create projects.'})
    @ApiBody({type: CreateProjectDto})
    create(@Body() createProjectDto: CreateProjectDto, @Req() req: any) {
        return this.projectsService.create(createProjectDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({summary: 'Get all projects', description: 'Retrieve the list of all projects.'})
    @ApiResponse({status: 200, description: 'Projects list retrieved successfully.'})
    findAll() {
        return this.projectsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiOperation({summary: 'Get a project by ID', description: 'Retrieve a project by its ID.'})
    @ApiParam({name: 'id', type: 'number', example: 1, description: 'Project identifier'})
    @ApiResponse({status: 200, description: 'Project retrieved successfully.'})
    @ApiResponse({status: 404, description: 'Project not found.'})
    findOne(@Param('id') id: string) {
        return this.projectsService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.CONTRACTOR)
    @Patch(':id')
    @ApiOperation({summary: 'Update a project', description: 'Update a project (owner only).'})
    @ApiParam({name: 'id', type: 'number', example: 1, description: 'Project identifier'})
    @ApiBody({type: UpdateProjectDto})
    @ApiResponse({status: 200, description: 'Project updated successfully.'})
    @ApiResponse({status: 403, description: 'Forbidden. Only the owner can update the project.'})
    @ApiResponse({status: 404, description: 'Project not found.'})
    update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Req() req: any) {
        return this.projectsService.update(+id, updateProjectDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({summary: 'Delete a project', description: 'Delete a project. Owner or admin can delete.'})
    @ApiParam({name: 'id', type: 'number', example: 1, description: 'Project identifier'})
    @ApiResponse({status: 200, description: 'Project deleted successfully.'})
    @ApiResponse({status: 403, description: 'Forbidden. You do not have permission to delete this project.'})
    @ApiResponse({status: 404, description: 'Project not found.'})
    remove(@Param('id') id: string, @Req() req: any) {
        return this.projectsService.remove(+id, req.user);
    }
}
