/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsUrl } from 'class-validator';

export class UploadTrackDto {
  @IsUrl({ protocols: ['https'] })
  link: string;
}
