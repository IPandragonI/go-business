import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { UserRole } from '../users/entities/userRole.enum';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
  }

  async create(createCategoryDto: CreateCategoryDto, user: { id: number; role: UserRole }) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create categories');
    }

    const category = this.categoryRepository.create({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
    });
    return await this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository.find({ relations: ['projects'] });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['projects', 'interests'],
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, user: { id: number; role: UserRole }) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update categories');
    }

    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: number, user: { id: number; role: UserRole }) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete categories');
    }

    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    await this.categoryRepository.remove(category);
    return { deleted: true };
  }
}
