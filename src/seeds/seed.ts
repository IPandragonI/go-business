import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { seedUsers } from './users.seed';
import { seedProjects } from './projects.seed';
import { UserRole } from '../modules/users/entities/userRole.enum';
import { seedCategories } from './categories.seed';
import { seedInterests } from './interests.seed';
import { seedInvestments } from './investments.seed';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  console.log('\n=== 🌱 Starting Database Seeding ===\n');

  const interests = await seedInterests(app);
  const users = await seedUsers(app, interests);
  const categories = await seedCategories(app, interests);
  const projects = await seedProjects(app, categories, users.filter((user) => user.role === UserRole.CONTRACTOR));
  const investors = users.filter((user) => user.role === UserRole.INVESTOR);
  await seedInvestments(app, projects, investors);

  console.log('\n=== ✅ Seeding completed successfully ===\n');

  await app.close();
}

seed()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during seeding:', error);
    process.exit(1);
  });
