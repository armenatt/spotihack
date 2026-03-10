import type { TPlaylist, TTrack } from "../../entities";

export const useTrackPlaylistStore = defineStore("trackPlaylist", () => {
  const currentlyPlayingPlaylist = ref<TPlaylist>();
  const currentPlaylist = ref<TPlaylist>();
  const currentlyPlayingTrack = ref<TTrack>();
  const isPlaying = ref(false);
  const playlists = ref<Omit<TPlaylist, "tracks">>();

  const { $services } = useNuxtApp();

  const getPlaylists = async () => {
    playlists.value = await $services.trackPlaylistService.getPlaylistList();
  };
  return {
    currentPlaylist,
    currentlyPlayingPlaylist,
    currentlyPlayingTrack,
    isPlaying,
    playlists,
    getPlaylists,
  };
});
