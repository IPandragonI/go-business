import { faker } from '@faker-js/faker';
import { INestApplicationContext } from '@nestjs/common';
import { User } from '../modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Investment } from '../modules/investments/entities/investment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../modules/projects/entities/project.entity';

export async function seedInvestments(
  app: INestApplicationContext,
  projects: Project[],
  investors: User[],
) {
  const investmentRepository = app.get<Repository<Investment>>(getRepositoryToken(Investment));

  const existingInvestments = await investmentRepository.find();
  if (existingInvestments.length > 0) {
    console.log(`Found ${existingInvestments.length} existing investments. Removing them...`);
    await investmentRepository.remove(existingInvestments);
  }

  console.log('Seeding investments...');

  const investments: Partial<Investment>[] = [];

  for (const project of projects) {
    const investmentCount = faker.number.int({ min: 2, max: 5 });

    for (let i = 0; i < investmentCount; i++) {
      const randomInvestor = faker.helpers.arrayElement(investors);

      const investment = investmentRepository.create({
        amount: faker.number.float({ min: 100, max: 50000 }),
        investor: randomInvestor,
        project: project,
        investedAt: faker.date.past({ years: 1 }),
      } as unknown as Partial<Investment>);
      investments.push(investment);
    }
  }

  const saved = await investmentRepository.save(investments);
  console.log(`Seeded ${saved.length} investments.`);

  return saved;
}

