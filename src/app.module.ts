import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildTypeOrmConfig } from '../config/typeorm.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { InterestsModule } from './modules/interests/interests.module';
import { InvestmentsModule } from './modules/investments/investments.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        buildTypeOrmConfig(configService),
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
    CategoriesModule,
    InterestsModule,
    InvestmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
