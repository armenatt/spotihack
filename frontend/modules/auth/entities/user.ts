import type { TPlaylist } from "~/modules/track-playlist/entities";

export type TUser = {
  id: string;
  email: string;
  username: string;
  phoneNumber: string;
  accessToken: string;
  refreshToken: string;
  playlists: TPlaylist[];
};
