import {faker} from "@faker-js/faker";
import * as bcrypt from 'bcrypt';
import {INestApplicationContext} from "@nestjs/common";
import {Repository} from "typeorm";
import {User} from "../modules/users/entities/user.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import {UserRole} from "../modules/users/entities/userRole.enum";

export async function seedUsers(app: INestApplicationContext) {
    const userRepository = app.get<Repository<User>>(getRepositoryToken(User));

    const existingUsers = await userRepository.find();
    if (existingUsers.length > 0) {
        console.log(`Found ${existingUsers.length} existing users. Removing them...`);
        await userRepository.remove(existingUsers);
    }

    console.log('Seeding users...');

    const users: Partial<User>[] = [];

    const makeUser = (role: UserRole, uniqueSuffix?: string) => {
        const firstname = faker.person.firstName();
        const lastname = faker.person.lastName();
        const domain = faker.internet.domainName();
        const local = `${firstname}.${lastname}`.replace(/[^a-zA-Z0-9.]/g, '').toLowerCase();
        const email = `${local}${uniqueSuffix ? '.' + uniqueSuffix : ''}@${domain}`;
        const password = faker.internet.password({length: 20});
        return userRepository.create({
            firstname,
            lastname,
            email,
            password,
            role,
        } as Partial<User>);
    };

    users.push(userRepository.create({
        firstname: "Go-Business",
        lastname: "Admin",
        email: "admin.go-business@mail.com",
        password: await bcrypt.hash('admin', 10),
        role: UserRole.ADMIN,
    } as Partial<User>));

    for (let i = 0; i < 5; i++) {
        users.push(makeUser(UserRole.INVESTOR, `investor`));
    }

    for (let i = 0; i < 20; i++) {
        users.push(makeUser(UserRole.CONTRACTOR, `contractor`));
    }

    const saved = await userRepository.save(users);
    console.log(`Seeded ${saved.length} users.`);

    return saved;
}
