import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ETrackStatuses } from './trackStatuses';
import { PlaylistTrack } from './playlist-track.entity';

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  author: string; // TODO: replace with entity in future
  @Column({ nullable: true })
  album: string; // TODO: replace with entity in future

  @Column({ enum: ETrackStatuses, default: ETrackStatuses.Started })
  status: ETrackStatuses;
  @Column({ nullable: true })
  duration: number;
  @Column({ nullable: true, unique: true })
  videoId: string;

  @OneToMany(() => PlaylistTrack, (playlistTrack) => playlistTrack.track, {
    onDelete: 'CASCADE',
  })
  playlistTrack: PlaylistTrack[];

  m3u8Raw: string;

  @CreateDateColumn()
  createdAt: Date;
}
