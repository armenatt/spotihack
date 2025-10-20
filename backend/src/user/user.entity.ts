import { Playlist } from 'src/track-playlist/entities/playlist.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ nullable: true, unique: true })
  phoneNumber: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
  @OneToOne(() => Playlist, (playlist) => playlist.user)
  @JoinColumn()
  favouriteTracks: Playlist;

  @OneToMany(() => Playlist, (playlist) => playlist.user, { cascade: true })
  playlists: Playlist[];
}
