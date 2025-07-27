import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(AuthGuard)
  @Get('/profile')
  profile(@Req() req: { user: { userId: string } }) {
    return this.userService.findOneById(req.user.userId);
  }
}
