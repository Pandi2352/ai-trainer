import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    async login(@Body() req) {
        // In a real app, use LocalStrategy/Guard to validate credentials first
        // For simplicity here, assuming body contains email/password validation logic or direct user object
        // But typically: @UseGuards(LocalAuthGuard) -> req.user is populated
        // Let's do a manual validation call for clarity or implement LocalStrategy later.
        // For now, let's assume we call validateUser manually or trust the input (NOT SAFE production practice without LocalStrategy).
        // Let's do it properly:
        const validUser = await this.authService.validateUser(req.email, req.password);
        if (!validUser) {
            return { message: 'Invalid credentials' }; // or Throw UnauthorizedException
        }
        return this.authService.login(validUser); // validUser should have _id
    }

    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    async register(@Body() createUserDto: any) {
        return this.authService.register(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
