import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { Project } from '../projects/entities/project.entity';
import { Interest } from '../interests/entities/interest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Project, Interest])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {
}
