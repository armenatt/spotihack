import type { TrackPlaylistApi } from "../adapters/api";

export class TrackPlaylistService {
  constructor(
    private api: TrackPlaylistApi,
    private store: any,
    private ws: WebSocket
  ) {}

  async getPlaylistList() {
    const res = await this.api.getPlaylistList();
    return res.data;
  }

  async getPlaylistById(id: string) {
    const res = await this.api.getPlaylistById(id);
    return res.data;
  }

  async addTrack(url: string, playlistId: string) {
    const res = await this.api.addTrack(url, playlistId);
    return res.data;
  }

  updateTrack() {
    // this.ws.
  }
}
