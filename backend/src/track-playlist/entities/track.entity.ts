import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ETrackStatuses } from './trackStatuses';

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
  @Column({ nullable: true })
  videoId: string;

  m3u8Raw: string;

  @CreateDateColumn()
  createdAt: Date;
}
