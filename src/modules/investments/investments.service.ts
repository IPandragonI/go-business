import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { Investment } from './entities/investment.entity';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { UserRole } from '../users/entities/userRole.enum';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {
  }

  async create(createInvestmentDto: CreateInvestmentDto, user: { id: number; role: UserRole }) {
    if (user.role !== UserRole.INVESTOR) {
      throw new ForbiddenException('Only investors can make investments');
    }

    const investor = await this.userRepository.findOne({ where: { id: user.id } });
    if (!investor) {
      throw new NotFoundException(`Investor with id ${user.id} not found`);
    }

    const project = await this.projectRepository.findOne({ where: { id: createInvestmentDto.projectId } });
    if (!project) {
      throw new NotFoundException(`Project with id ${createInvestmentDto.projectId} not found`);
    }

    const investment = this.investmentRepository.create({
      amount: createInvestmentDto.amount,
      investor: investor,
      project: project,
      investedAt: new Date(),
    });

    return await this.investmentRepository.save(investment);
  }

  async findAll() {
    return await this.investmentRepository.find({
      relations: ['investor', 'project', 'project.owner', 'project.categories'],
      order: { investedAt: 'DESC' },
    });
  }

  async findByInvestor(userId: number, user: { id: number; role: UserRole }) {
    if (user.id !== userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only view your own investments');
    }

    const investorExists = await this.userRepository.findOne({ where: { id: userId } });
    if (!investorExists) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return await this.investmentRepository.find({
      where: { investor: { id: userId } },
      relations: ['investor', 'project', 'project.owner', 'project.categories'],
      order: { investedAt: 'DESC' },
    });
  }

  async findByProject(projectId: number, user: { id: number; role: UserRole }) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['owner'],
    });
    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }

    if (project.owner.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only view investments for your own projects');
    }

    return await this.investmentRepository.find({
      where: { project: { id: projectId } },
      relations: ['investor', 'project'],
      order: { investedAt: 'DESC' },
    });
  }

  async getProjectStats(projectId: number) {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }

    const investments = await this.investmentRepository.find({
      where: { project: { id: projectId } },
    });

    const totalAmount = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const investorCount = investments.length;

    return {
      projectId,
      totalFunded: totalAmount,
      investorCount,
      investments,
    };
  }

  async remove(investmentId: number, user: { id: number; role: UserRole }) {
    const investment = await this.investmentRepository.findOne({
      where: { id: investmentId },
      relations: ['investor', 'project'],
    });

    if (!investment) {
      throw new NotFoundException(`Investment with id ${investmentId} not found`);
    }

    if (investment.investor.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only cancel your own investments');
    }

    await this.investmentRepository.remove(investment);
    return { deleted: true };
  }
}

