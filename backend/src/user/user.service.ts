import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Playlist } from 'src/track-playlist/entities/playlist.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async findOneById(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        favouriteTracks: {
          tracks: true,
        },
      },
    });
  }

  async updateUser(user: User) {
    return this.userRepository.save(user);
  }

  async createUser(
    email: string,
    username: string,
    password: string,
    playlist: Playlist,
  ) {
    const hash = await bcrypt.hash(password, 5);

    const newUser = this.userRepository.create({
      email,
      username,
      password: hash,
      favouriteTracks: playlist,
    });

    return this.userRepository.save(newUser);
  }
}
