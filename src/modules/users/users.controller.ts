import {Controller, Get, Patch, Param, Delete, NotFoundException, UseGuards, Body} from '@nestjs/common';
import {UsersService} from './users.service';
import {UpdateUserDto} from './dto/update-user.dto';
import {ApiOperation, ApiParam, ApiResponse} from "@nestjs/swagger";
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {Roles} from "../../auth/decorators/roles.decorator";
import {RolesGuard} from "../../auth/guards/roles.guard";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get()
    @ApiOperation({
        summary: 'Récupérer tous les utilisateurs',
        description: 'Permet de récupérer la liste de tous les utilisateurs.'
    })
    @ApiResponse({status: 200, description: 'Liste des utilisateurs récupérée avec succès.'})
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Récupérer un utilisateur par ID',
        description: 'Permet de récupérer les détails d\'un utilisateur en utilisant son ID.'
    })
    @ApiParam({
        name: 'id',
        type: 'number',
        example: 1,
        description: "Identifiant de l'utilisateur",
    })
    @ApiResponse({status: 200, description: 'Utilisateur récupéré avec succès.'})
    @ApiResponse({status: 404, description: 'Utilisateur non trouvé.'})
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        const user = this.usersService.findOne(+id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Mettre à jour un utilisateur',
        description: 'Permet de mettre à jour les informations d\'un utilisateur en utilisant son ID.'
    })
    @ApiParam({
        name: 'updateUserDto',
        type: UpdateUserDto,
        description: "Données de mise à jour d'un utilisateur",
    })
    @ApiResponse({status: 200, description: 'Utilisateur mis à jour avec succès.'})
    @ApiResponse({status: 404, description: 'Utilisateur non trouvé.'})
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const user = this.usersService.update(+id, updateUserDto);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Supprimer un utilisateur',
        description: 'Permet de supprimer un utilisateur en utilisant son ID.'
    })
    @ApiParam({
        name: 'id',
        type: 'number',
        example: 1,
        description: "Identifiant de l'utilisateur",
    })
    @ApiResponse({status: 200, description: 'Utilisateur supprimé avec succès.'})
    @ApiResponse({status: 404, description: 'Utilisateur non trouvé.'})
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    remove(@Param('id') id: string) {
        const user = this.usersService.remove(+id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
}
