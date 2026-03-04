import type { TPlaylist, TTrack } from "../../entities";

export const useTrackPlaylistStore = defineStore("trackPlaylist", () => {
  const currentlyPlayingPlaylist = ref<TPlaylist>();
  const currentPlaylist = ref<TPlaylist>();
  const currentlyPlayingTrack = ref<TTrack>();
  const isPlaying = ref(false);

  return {
    currentPlaylist,
    currentlyPlayingPlaylist,
    currentlyPlayingTrack,
    isPlaying,
  };
});
