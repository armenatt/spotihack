import axios from "axios";
import type { TPlaylist, TTrack } from "../../entities";

export class TrackPlaylistApi {
  getPlaylistList() {
    return axios.get("/playlists");
  }

  getPlaylistById(id: string) {
    return axios.get("/playlist/" + id);
  }

  addTrack(url: string, playlistId: string) {
    return axios.post<Pick<TTrack, "id">>("/track/upload", {
      link: url,
      playlistId,
    });
  }
}
