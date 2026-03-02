import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import {seedUsers} from "./users.seed";
import {seedProjects} from "./projects.seed";
import {UserRole} from "../modules/users/entities/userRole.enum";

async function seed() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const users = await seedUsers(app);
    await seedProjects(app, users.filter(user => user.role === UserRole.CONTRACTOR));

    await app.close();
}

seed()
    .then(() => {
        console.log('Seeding completed successfully');
    })
    .catch((error) => {
        console.error('Error during seeding:', error);
    });
