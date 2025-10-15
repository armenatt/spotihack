import type { ETrackStatus } from "./trackStatuses";

export type TTrack = {
  id: string;
  name: string;
  duration: number;
  videoId: string;
  status: ETrackStatus;
  createdAt: Date;
};
