import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../users/entities/userRole.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a category', description: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can create categories.' })
  @ApiBody({ type: CreateCategoryDto })
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: any) {
    return this.categoriesService.create(createCategoryDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all categories', description: 'Retrieve the list of all categories' })
  @ApiResponse({ status: 200, description: 'Categories list retrieved successfully.' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID', description: 'Retrieve a category by its ID' })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'Category identifier' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a category', description: 'Update a category (admin only).' })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'Category identifier' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Category updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can update categories.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Req() req: any,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category', description: 'Delete a category' })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'Category identifier' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can delete categories.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.categoriesService.remove(+id, req.user);
  }
}
