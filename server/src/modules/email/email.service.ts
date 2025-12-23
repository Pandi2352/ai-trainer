import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
    private resend: Resend;

    constructor(private configService: ConfigService) {
        // Ideally this comes from config, defaulting to placeholder if missing
        const apiKey = this.configService.get('RESEND_API_KEY') || 're_GzxSAKU3_CGBwr7KmH5q6Az9PP1sFmRrJ';
        this.resend = new Resend(apiKey);
    }

    async sendInvitation(email: string, inviteLink: string, password?: string) {
        if (!this.configService.get('RESEND_API_KEY')) {
            console.log(`[MOCK EMAIL] To: ${email}, Link: ${inviteLink}, Pwd: ${password}`);
            return { id: 'mock_id' };
        }

        try {
            return await this.resend.emails.send({
                from: 'OmniTrain <onboarding@resend.dev>', // Update with verify domain in prod
                to: email,
                subject: 'You have been invited to OmniTrain AI',
                html: `<p>Welcome!</p><p>You have been invited to join OmniTrain AI.</p><p>Link: <a href="${inviteLink}">${inviteLink}</a></p><p>Temporary Password: <strong>${password}</strong></p>`,
            });
        } catch (error) {
            console.error('Email sending failed (falling back to mock):', error);
            // Fallback to mock so the flow doesn't break during dev/demo
            console.log(`[MOCK EMAIL FALLBACK] To: ${email}, Link: ${inviteLink}, Pwd: ${password}`);
            return { id: 'mock_fallback_id' };
        }
    }
}
