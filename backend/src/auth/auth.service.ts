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

  profile(id: string) {
    return this.userService.findOneById(id);
  }

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
    console.log('run');

    response.setCookie('authentication', accessToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
      domain: '.spotihack.ru',
      sameSite: 'none',
      secure: true,
    });

    response.setCookie('refresh', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      domain: '.spotihack.ru',
      sameSite: 'none',
      secure: true,
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

  async refresh(token: string, response: FastifyReply) {
    const sevenDays =  7 * 24 * 60 * 60;
    const thirtyDays = 30 * 24 * 60 * 60;

    const accessToken = await this.jwtService.verifyAsync(
      token,
      { secret: this.configService.getOrThrow('SECRET_CODE'), 'maxAge': sevenDays},
    )


    const refreshToken = await this.jwtService.verifyAsync(
      token,
      { secret: this.configService.getOrThrow('SECRET_CODE'), 'maxAge': thirtyDays},
    );

    response.setCookie('authentication', accessToken, {
      httpOnly: true,
      maxAge: sevenDays,
      domain: '.spotihack.ru',
      sameSite: 'none',
      secure: true,
      path: '/',
    });

    response.setCookie('refresh', refreshToken, {
      httpOnly: true,
      maxAge: thirtyDays,
      domain: '.spotihack.ru',
      sameSite: 'none',
      secure: true,
      path: '/',
    });

    return {
      accessToken,
      refreshToken 
    };
  }
}
