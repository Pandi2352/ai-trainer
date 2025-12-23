import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { InviteService } from './invite.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Invite')
@ApiBearerAuth()
@Controller('invite')
export class InviteController {
    constructor(private inviteService: InviteService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    @ApiOperation({ summary: 'Invite a new user (Admin only)' })
    async invite(@Body() body: { email: string; role?: string }) {
        return this.inviteService.inviteUser(body.email, body.role);
    }
}
