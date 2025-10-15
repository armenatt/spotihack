import type { TPlaylist, TTrack } from "../../entities";

export const useTrackPlaylistStore = defineStore("trackPlaylist", () => {
  const favouriteTracks = ref<TPlaylist>();
  const currentlyPlayingPlaylist = ref<TPlaylist>();
  const currentlyPlayingTrack = ref<TTrack>();
  const isPlaying = ref(false);

  return {
    favouriteTracks,
    currentlyPlayingPlaylist,
    currentlyPlayingTrack,
    isPlaying,
  };
});
