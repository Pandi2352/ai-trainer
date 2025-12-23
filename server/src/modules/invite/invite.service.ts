import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { AuthService } from '../auth/auth.service';
import * as crypto from 'crypto';

@Injectable()
export class InviteService {
    constructor(
        private emailService: EmailService,
        private authService: AuthService,
    ) { }

    async inviteUser(email: string, role: string = 'trainee') {
        // Generate random password
        const temporaryPassword = crypto.randomBytes(4).toString('hex');

        // Register user via AuthService (creates user in DB)
        const user = await this.authService.register({
            email,
            password: temporaryPassword,
            name: 'Invited User', // Placeholder name
            role,
        });

        // Send email
        // In prod, link would be frontend URL
        const loginLink = 'http://localhost:5173/login';
        await this.emailService.sendInvitation(email, loginLink, temporaryPassword);

        return { message: 'Invitation sent', user };
    }
}
