import type { TPlaylist, TTrack } from "../../entities";

export const useTrackPlaylistStore = defineStore("trackPlaylist", () => {
  const currentlyPlayingPlaylist = ref<TPlaylist>();
  const currentlPlaylist = ref<TPlaylist>();
  const currentlyPlayingTrack = ref<TTrack>();
  const isPlaying = ref(false);

  return {
    currentlPlaylist,
    currentlyPlayingPlaylist,
    currentlyPlayingTrack,
    isPlaying,
  };
});
