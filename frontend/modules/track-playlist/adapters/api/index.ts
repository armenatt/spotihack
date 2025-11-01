import axios from "axios";

export class TrackPlaylistApi {
  getPlaylistList() {
    return axios.get("/playlists");
  }

  getPlaylistById(id: string) {
    return axios.get("/playlist/" + id);
  }
}
