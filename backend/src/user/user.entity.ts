import { Playlist } from 'src/track-playlist/entities/playlist.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => Playlist, (playlist) => playlist.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  playlists: Playlist[];
}
