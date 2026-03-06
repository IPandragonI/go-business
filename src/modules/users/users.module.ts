import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../../auth/auth.module';
import { InterestsModule } from '../interests/interests.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule), InterestsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {
}
