import type { TTrack } from "./track";

export type TPlaylist = {
  id: string;
  name: string;
  type: "private" | "public";
  isFavourite: boolean;
  tracks: TTrack[];
  durationSum: number;
  trackCount: number;
};
