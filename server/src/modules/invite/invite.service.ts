import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class InviteService {
    constructor(
        private authService: AuthService,
    ) { }

    async inviteUser(email: string, role: string = 'trainee') {
        // Default password for all new users
        const defaultPassword = 'Test@123';

        // Register user via AuthService (creates user in DB)
        const user = await this.authService.register({
            email,
            password: defaultPassword,
            name: 'New User', // Placeholder name
            role,
        });

        // No email sending
        return { message: 'User added successfully', user };
    }
}
