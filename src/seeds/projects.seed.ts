import {faker} from "@faker-js/faker";
import {INestApplicationContext} from "@nestjs/common";
import {User} from "../modules/users/entities/user.entity";
import {Repository} from "typeorm";
import {Project} from "../modules/projects/entities/project.entity";
import {getRepositoryToken} from "@nestjs/typeorm";

export async function seedProjects(app: INestApplicationContext, contractors: User[]) {
    const projectRepository = app.get<Repository<Project>>(getRepositoryToken(Project));

    const existingProjects = await projectRepository.find();
    if (existingProjects.length > 0) {
        console.log(`Found ${existingProjects.length} existing projects. Removing them...`);
        await projectRepository.remove(existingProjects);
    }

    console.log('Seeding projects...');

    const projects: Partial<Project>[] = [];

    for (let i = 0; i < contractors.length; i++) {
        const project = projectRepository.create({
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            budget: faker.number.int({min: 1000, max: 100000}),
            category: faker.lorem.word(),
            owner: contractors[i],
        } as Partial<Project>);
        projects.push(project);
    }

    const saved = await projectRepository.save(projects);
    console.log(`Seeded ${saved.length} projects.`);

    return saved;
}