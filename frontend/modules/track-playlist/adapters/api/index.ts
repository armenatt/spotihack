import axios from "axios";

export class TrackPlaylistApi {
  getFavouriteTracks() {
    return axios.get("/user/favourite-tracks");
  }
}
