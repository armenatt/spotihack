import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register-dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dtos/login-dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TrackPlaylistService } from 'src/track-playlist/track-playlist.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.entity';
import { FastifyReply } from 'fastify';

@Injectable()
export class AuthService {
  constructor(
    @Inject() private readonly userService: UserService,
    @Inject() private readonly trackPlaylistService: TrackPlaylistService,
    @Inject() private readonly jwtService: JwtService,
    @Inject() private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto, response: FastifyReply) {
    const exists = await this.userService.findOneByEmail(loginDto.email);

    if (!exists) {
      throw new NotFoundException('Email not found');
    }

    const isValid = await bcrypt.compare(loginDto.password, exists.password);

    if (!isValid) {
      throw new UnauthorizedException('Wrong password');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        id: exists.id,
        email: exists.email,
      },
      { secret: this.configService.get('SECRET_CODE'), expiresIn: '7d' },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        id: exists.id,
        email: exists.email,
      },
      { secret: this.configService.get('SECRET_CODE'), expiresIn: '30d' },
    );

    response.setCookie('authentication', accessToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    response.setCookie('refresh', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      ...exists,
      password: undefined,
      accessToken,
      refreshToken,
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

  async refresh(user: User, response: FastifyReply) {
    const refreshToken = await this.jwtService.signAsync(
      {
        ...user,
      },
      { secret: this.configService.getOrThrow('SECRET_CODE') },
    );

    response.setCookie('authentication', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    response.setCookie('refresh', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken: refreshToken,
    };
  }
}
