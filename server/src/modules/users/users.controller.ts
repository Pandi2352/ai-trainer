import { Controller, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get()
    @ApiOperation({ summary: 'List all users (Admin only)' })
    findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id/role')
    @ApiOperation({ summary: 'Update user role (Admin only)' })
    updateRole(@Param('id') id: string, @Body('role') role: string) {
        return this.usersService.update(id, { role });
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOperation({ summary: 'Get current user profile' })
    getProfile(@Request() req) {
        return this.usersService.findById(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    @ApiOperation({ summary: 'Update current user profile' })
    updateProfile(@Request() req, @Body() updateData: any) {
        delete updateData.role;
        delete updateData.password;
        return this.usersService.update(req.user.userId, updateData);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('profile/password')
    @ApiOperation({ summary: 'Change password' })
    async changePassword(@Request() req, @Body() body: any) {
        const { password } = body;
        // In a real app, validate old password here
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return this.usersService.setPassword(req.user.userId, hash);
    }
}
