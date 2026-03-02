import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches} from 'class-validator';
import {UserRole} from '../../modules/users/entities/userRole.enum';

export class RegisterDto {
    @ApiProperty({example: 'Jean', description: "Prénom de l'utilisateur"})
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @ApiProperty({example: 'Dupont', description: "Nom de famille de l'utilisateur"})
    @IsString()
    @IsNotEmpty()
    lastname: string;

    @ApiProperty({example: 'jean.dupont@example.com', description: "Adresse email de l'utilisateur"})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({example: 'P@ssw0rd!', description: 'Mot de passe (min 8 caractères)'})
    @IsString()
    @Length(8, 128)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial',
    })
    password: string;

    @ApiProperty({example: UserRole.INVESTOR, enum: UserRole, description: "Rôle de l'utilisateur"})
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}
