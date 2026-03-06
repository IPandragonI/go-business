import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { AssignInterestsDto } from './dto/assign-interests.dto';
import { Interest } from './entities/interest.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/userRole.enum';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest)
    private readonly interestRepository: Repository<Interest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  async create(createInterestDto: CreateInterestDto, user: { id: number; role: UserRole }) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create interests');
    }

    const interest = this.interestRepository.create({
      name: createInterestDto.name,
      description: createInterestDto.description,
    });
    return await this.interestRepository.save(interest);
  }

  async findAll() {
    return await this.interestRepository.find({ relations: ['users'] });
  }

  async findOne(id: number) {
    const interest = await this.interestRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!interest) {
      throw new NotFoundException(`Interest with id ${id} not found`);
    }
    return interest;
  }

  async update(id: number, updateInterestDto: UpdateInterestDto, user: { id: number; role: UserRole }) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update interests');
    }

    const interest = await this.interestRepository.findOne({ where: { id } });
    if (!interest) {
      throw new NotFoundException(`Interest with id ${id} not found`);
    }

    Object.assign(interest, updateInterestDto);
    return await this.interestRepository.save(interest);
  }

  async remove(id: number, user: { id: number; role: UserRole }) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete interests');
    }

    const interest = await this.interestRepository.findOne({ where: { id } });
    if (!interest) {
      throw new NotFoundException(`Interest with id ${id} not found`);
    }

    await this.interestRepository.remove(interest);
    return { deleted: true };
  }

  async assignToUser(userId: number, assignInterestsDto: AssignInterestsDto, currentUser: {
    id: number;
    role: UserRole
  }) {
    if (currentUser.id !== userId && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only assign interests to yourself');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const interests = await this.interestRepository.findBy({ id: In(assignInterestsDto.interestIds) });
    if (interests.length !== assignInterestsDto.interestIds.length) {
      throw new NotFoundException('Some interests were not found');
    }

    user.interests = interests;
    return await this.userRepository.save(user);
  }

  async getUserInterests(userId: number, currentUser: { id: number; role: UserRole }) {
    if (currentUser.id !== userId && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only view your own interests');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return user.interests;
  }
}

