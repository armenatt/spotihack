import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Track } from './track.entity';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => User, (user) => user.playlists)
  user: User;
  @ManyToMany(() => Track)
  @JoinTable()
  tracks: Track[];
}
