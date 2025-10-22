import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlaylistTrack } from './playlist-track.entity';
import { EPlaylistType } from './playlistType';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  name?: string;
  @ManyToOne(() => User, (user) => user.playlists)
  user: User;

  @OneToMany(() => PlaylistTrack, (playlistTrack) => playlistTrack.playlist)
  playlistTrack: PlaylistTrack[];

  @Column({ default: EPlaylistType.Private })
  type: EPlaylistType;

  @Column({ default: false })
  favourite?: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
