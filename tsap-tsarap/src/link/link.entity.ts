import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  link: string;

  @Column()
  videoId: string;
}
