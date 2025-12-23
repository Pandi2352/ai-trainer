import { Module } from '@nestjs/common';

import { EmailModule } from '../email/email.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';

@Module({
    imports: [EmailModule, AuthModule, UsersModule],
    controllers: [InviteController],
    providers: [InviteService],
})
export class InviteModule { }
