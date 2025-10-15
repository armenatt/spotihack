import type { TrackPlaylistApi } from "../adapters/api";

export class TrackPlaylistService {
  constructor(private api: TrackPlaylistApi, private store: any) {}

  async getFavouriteTracks() {
    const result = await this.api.getFavouriteTracks();
    this.store.favouriteTracks = result.data;
    return result.data;
  }
}
