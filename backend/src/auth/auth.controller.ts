import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register-dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login-dto';
import { User } from 'src/user/user.entity';
import { FastifyReply } from 'fastify';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(@Inject() private readonly authService: AuthService) {}
  @Post('register')
  regiser(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDto, @Res({ passthrough: true }) res: FastifyReply) {
    return this.authService.login(body, res);
  }
  @UseGuards(AuthGuard)
  @Post('refresh')
  refresh(
    @Req() req: { user: User },
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return this.authService.refresh(req.user, res);
  }
}
