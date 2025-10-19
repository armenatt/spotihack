import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlaylistTrack } from './playlist-track.entity';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => User, (user) => user.playlists)
  user: User;
  @OneToOne(() => User, (user) => user.favouriteTracks)
  favouritedBy: User;

  @OneToMany(() => PlaylistTrack, (playlistTrack) => playlistTrack.playlist)
  playlistTrack: PlaylistTrack[];

  @CreateDateColumn()
  createdAt: Date;
}
