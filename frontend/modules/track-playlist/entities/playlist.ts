import type { TTrack } from "./track";

enum EPlaylistPrivacyType {
  Private = "private",
  Public = "public",
}

export type TPlaylist = {
  id: string;
  name: string;
  type: `${EPlaylistPrivacyType}`;
  favourite: boolean;
  tracks: TTrack[];
  durationSum: number;
  trackCount: number;
};
