import {Controller, Get, Param, Delete, UseGuards, Body, Req, Put, Patch} from '@nestjs/common';
import {UsersService} from './users.service';
import {UpdateUserDto} from './dto/update-user.dto';
import {ApiOperation, ApiParam, ApiResponse, ApiBearerAuth} from "@nestjs/swagger";
import {JwtAuthGuard} from '../../auth/guards/jwt-auth.guard';
import {Roles} from "../../auth/decorators/roles.decorator";
import {RolesGuard} from "../../auth/guards/roles.guard";

@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get()
    @ApiOperation({summary: 'Get all users', description: 'Retrieve the list of all users.'})
    @ApiResponse({status: 200, description: 'Users list retrieved successfully.'})
    @ApiResponse({status: 403, description: 'Forbidden. Only admin can retrieve the list of users.'})
    async findAll() {
        return await this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiOperation({summary: 'Get a user by ID', description: 'Retrieve a user details by their ID.'})
    @ApiParam({name: 'id', type: 'number', example: 1, description: 'User identifier',})
    @ApiResponse({status: 200, description: 'User retrieved successfully.'})
    @ApiResponse({status: 403, description: 'Forbidden. Only the owner can retrieve their details.'})
    @ApiResponse({status: 404, description: 'User not found.'})
    async findOne(@Param('id') id: string) {
        return await this.usersService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiOperation({summary: 'Update a user', description: 'Update a user information by ID.'})
    @ApiParam({name: 'updateUserDto', type: UpdateUserDto, description: 'User update payload',})
    @ApiResponse({status: 200, description: 'User updated successfully.'})
    @ApiResponse({status: 403, description: 'Forbidden. Only the owner can update their information.'})
    @ApiResponse({status: 404, description: 'User not found.'})
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: any) {
        return await this.usersService.update(+id, updateUserDto, req.user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    @ApiOperation({summary: 'Delete a user', description: 'Delete a user by ID.'})
    @ApiParam({name: 'id', type: 'number', example: 1, description: 'User identifier',})
    @ApiResponse({status: 200, description: 'User deleted successfully.'})
    @ApiResponse({status: 403, description: 'Forbidden. Only admin can delete users.'})
    @ApiResponse({status: 404, description: 'User not found.'})
    async remove(@Param('id') id: string, @Req() req: any) {
        return await this.usersService.remove(+id, req.user);
    }
}
