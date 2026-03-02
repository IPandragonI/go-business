import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import {seedUsers} from "./users.seed";

async function seed() {
    const app = await NestFactory.createApplicationContext(AppModule);

    await seedUsers(app);

    await app.close();
}

seed()
    .then(() => {
        console.log('Seeding completed successfully');
    })
    .catch((error) => {
        console.error('Error during seeding:', error);
    });
