import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
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
  @OneToOne(() => User, (user) => user.favouriteTracks)
  favouritedBy: User;

  @ManyToMany(() => Track, { cascade: true })
  @JoinTable()
  tracks: Track[];

  @CreateDateColumn()
  createdAt: Date;
}
