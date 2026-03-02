import {Controller, Post, Body} from '@nestjs/common';
import {AuthService} from './auth.service';
import {RegisterDto} from './dto/register.dto';
import {LoginDto} from './dto/login.dto';
import {ApiOperation, ApiResponse} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('register')
    @ApiOperation({summary: 'Inscrire un utilisateur'})
    @ApiResponse({status: 201, description: 'Utilisateur inscrit avec succès'})
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @ApiOperation({summary: 'Se connecter'})
    @ApiResponse({status: 200, description: 'Connexion réussie, token JWT retourné'})
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}
