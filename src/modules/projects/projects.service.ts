import {Injectable, NotFoundException, ForbiddenException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateProjectDto} from './dto/create-project.dto';
import {UpdateProjectDto} from './dto/update-project.dto';
import {Project} from './entities/project.entity';
import {UserRole} from '../users/entities/userRole.enum';
import {User} from "../users/entities/user.entity";

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    }

    async create(createProjectDto: CreateProjectDto, user: { id: number; role: UserRole }) {
        if (user.role !== UserRole.CONTRACTOR) {
            throw new ForbiddenException('Only contractors can create projects');
        }

        const owner = await this.userRepository.findOne({where: {id: user.id}});
        if (!owner) {
            throw new NotFoundException(`User with id ${user.id} not found`);
        }

        const project = this.projectRepository.create({...createProjectDto, owner: owner});
        return await this.projectRepository.save(project);
    }

    async findAll() {
        return await this.projectRepository.find();
    }

    async findOne(id: number) {
        const project = await this.projectRepository.findOne({where: {id}});
        if (!project) throw new NotFoundException(`Project with id ${id} not found`);
        return project;
    }

    async update(id: number, updateProjectDto: UpdateProjectDto, user: { id: number; role: UserRole }) {
        const project = await this.projectRepository.findOne({where: {id}});
        if (!project) throw new NotFoundException(`Project with id ${id} not found`);

        if (project.owner.id !== user.id) {
            throw new ForbiddenException('You are not the owner of this project');
        }

        Object.assign(project, updateProjectDto);
        return await this.projectRepository.save(project);
    }

    async remove(id: number, user: { id: number; role: UserRole }) {
        const project = await this.projectRepository.findOne({where: {id}});
        if (!project) throw new NotFoundException(`Project with id ${id} not found`);

        if (project.owner.id !== user.id && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('You do not have permission to delete this project');
        }

        await this.projectRepository.remove(project);
        return {deleted: true};
    }
}
