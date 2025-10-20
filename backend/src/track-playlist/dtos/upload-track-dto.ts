import { IsNotEmpty, IsUrl } from 'class-validator';

export class UploadTrackDto {
  @IsUrl({ protocols: ['https'] })
  link: string;
  @IsNotEmpty()
  playlistId: string;
}
