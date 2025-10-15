import { ETrackStatuses } from '../entities/trackStatuses';

export class TrackUpadteDto {
  id: string;
  status: ETrackStatuses;
  name?: string;
  duration?: number;
}
