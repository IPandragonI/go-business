import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { UserRole } from '../users/entities/userRole.enum';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
  }

  async create(createProjectDto: CreateProjectDto, user: { id: number; role: UserRole }) {
    if (user.role !== UserRole.CONTRACTOR) {
      throw new ForbiddenException('Only contractors can create projects');
    }

    const owner = await this.userRepository.findOne({ where: { id: user.id } });
    if (!owner) {
      throw new NotFoundException(`User with id ${user.id} not found`);
    }

    let categories: Category[] = [];
    if (createProjectDto.categories && createProjectDto.categories.length > 0) {
      categories = await this.categoryRepository.findBy({ id: In(createProjectDto.categories) });
      if (categories.length !== createProjectDto.categories.length) {
        throw new NotFoundException('One or more categories not found');
      }
    }

    const project = this.projectRepository.create({
      title: createProjectDto.title,
      description: createProjectDto.description,
      budget: createProjectDto.budget,
      categories: categories,
      owner: owner,
    });
    return await this.projectRepository.save(project);
  }

  async findAll() {
    return await this.projectRepository.find({ relations: ['owner', 'categories'] });
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['owner', 'categories'],
    });
    if (!project) throw new NotFoundException(`Project with id ${id} not found`);
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, user: { id: number; role: UserRole }) {
    const project = await this.projectRepository.findOne({ where: { id }, relations: ['owner'] });
    if (!project) throw new NotFoundException(`Project with id ${id} not found`);

    if (project.owner.id !== user.id) {
      throw new ForbiddenException('You are not the owner of this project');
    }

    Object.assign(project, updateProjectDto);
    return await this.projectRepository.save(project);
  }

  async remove(id: number, user: { id: number; role: UserRole }) {
    const project = await this.projectRepository.findOne({ where: { id }, relations: ['owner'] });
    if (!project) throw new NotFoundException(`Project with id ${id} not found`);

    if (project.owner.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You do not have permission to delete this project');
    }

    await this.projectRepository.remove(project);
    return { deleted: true };
  }

  async addCategory(projectId: number, categoryId: number, user: { id: number; role: UserRole }) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['owner', 'categories'],
    });
    if (!project) throw new NotFoundException(`Project with id ${projectId} not found`);

    if (project.owner.id !== user.id) {
      throw new ForbiddenException('You are not the owner of this project');
    }

    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) throw new NotFoundException(`Category with id ${categoryId} not found`);

    if (!project.categories.find(c => c.id === categoryId)) {
      project.categories.push(category);
      await this.projectRepository.save(project);
    }

    return project;
  }

  async removeCategory(projectId: number, categoryId: number, user: { id: number; role: UserRole }) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['owner', 'categories'],
    });
    if (!project) throw new NotFoundException(`Project with id ${projectId} not found`);

    if (project.owner.id !== user.id) {
      throw new ForbiddenException('You are not the owner of this project');
    }

    project.categories = project.categories.filter(c => c.id !== categoryId);
    await this.projectRepository.save(project);

    return project;
  }

  async getRecommendedProjects(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (!user.interests || user.interests.length === 0) {
      return await this.projectRepository.find({
        relations: ['owner', 'categories'],
        order: { createdAt: 'DESC' },
        take: 10,
      });
    }

    const allProjects = await this.projectRepository.find({
      relations: ['owner', 'categories', 'categories.interests'],
    });

    const projectScores = allProjects.map(project => {
      let score = 0;

      if (project.categories && project.categories.length > 0) {
        project.categories.forEach(category => {
          if (category.interests && category.interests.length > 0) {
            category.interests.forEach(interest => {
              if (user.interests.some(userInterest => userInterest.id === interest.id)) {
                score += 1;
              }
            });
          }
        });
      }

      return { project, score };
    });

    return projectScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(ps => ps.project);
  }
}
