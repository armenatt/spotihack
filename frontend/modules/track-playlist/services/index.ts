import type { TrackPlaylistApi } from "../adapters/api";

export class TrackPlaylistService {
  constructor(private api: TrackPlaylistApi, private store: any) {}

  async getPlaylistList() {
    return (await this.api.getPlaylistList()).data;
  }

  async getPlaylistById(id: string) {
    return (await this.api.getPlaylistById(id)).data;
  }
}
