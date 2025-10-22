import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register-dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dtos/login-dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TrackPlaylistService } from 'src/track-playlist/track-playlist.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject() private readonly userService: UserService,
    @Inject() private readonly trackPlaylistService: TrackPlaylistService,
    @Inject() private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const exists = await this.userService.findOneByEmail(loginDto.email);

    if (!exists) {
      throw new NotFoundException('Email not found');
    }

    const isValid = await bcrypt.compare(loginDto.password, exists.password);

    if (!isValid) {
      throw new UnauthorizedException('Wrong password');
    }

    return {
      ...exists,
      access_token: await this.jwtService.signAsync(
        {
          id: exists.id,
          email: exists.email,
        },
        { secret: 'prikol' },
      ),
    };
  }

  async register(registerDto: RegisterDto) {
    const alreadyExists = await this.userService.findOneByEmail(
      registerDto.email,
    );

    if (alreadyExists) {
      throw new BadRequestException('Email already exists');
    }

    const newPlaylist = await this.trackPlaylistService.createPlaylist({
      favourite: true,
    });

    const newUser = await this.userService.createUser(
      registerDto.email,
      registerDto.username,
      registerDto.password,
      newPlaylist,
    );

    newPlaylist.user = newUser;

    await this.trackPlaylistService.updatePlaylist(newPlaylist);

    return newUser;
  }
}
