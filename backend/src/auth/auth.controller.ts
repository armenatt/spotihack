import { Body, Controller, Inject, Post } from '@nestjs/common';
import { RegisterDto } from './dtos/register-dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login-dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject() private readonly authService: AuthService) {}
  @Post('register')
  regiser(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
