import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Track } from './track.entity';
import { Playlist } from './playlist.entity';

@Entity()
export class PlaylistTrack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Track, (track) => track.playlistTrack)
  track: Track;

  @ManyToOne(() => Playlist, (playlist) => playlist.playlistTrack)
  playlist: Playlist;

  @Column({ nullable: true })
  startTime: number;

  @Column({ nullable: true })
  endTime: number;

  @Column({ nullable: true })
  customName: string;

  @CreateDateColumn()
  createdAt: Date;
}
