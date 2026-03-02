import {IsEmail, IsEnum, IsOptional, IsString, Length, Matches} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/userRole.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Jean', description: 'Prénom de l\'utilisateur' })
  @IsString()
  @IsOptional()
  firstname?: string;

  @ApiPropertyOptional({ example: 'Dupont', description: 'Nom de famille de l\'utilisateur' })
  @IsString()
  @IsOptional()
  lastname?: string;

  @ApiPropertyOptional({ example: 'jean.dupont@example.com', description: "Adresse email de l'utilisateur" })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'P@ssw0rd!', description: 'Mot de passe (min 8 caractères)' })
  @IsString()
  @Length(8, 128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial',
  })
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: UserRole.INVESTOR, enum: UserRole, description: "Rôle de l'utilisateur" })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
