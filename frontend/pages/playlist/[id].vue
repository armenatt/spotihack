<template>
  <div class="playlists-page">
    <Playlist
      v-if="playlist"
      :playlist="playlist"
      :favourite-playlist="playlist?.favourite"
      :current-track="currentlyPlayingTrack"
      :current-playlist-id="currentlyPlayingPlaylist?.id"
      :playing="isPlaying"
      :username="user.username"
      @track="onChooseTrack"
      @play-playlist="onPlayPlaylist"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/modules/auth/adapters/store";
import { Playlist } from "~/modules/track-playlist";
import { useTrackPlaylistStore } from "~/modules/track-playlist/adapters/store";
import type { TPlaylist, TTrack } from "~/modules/track-playlist/entities";

const { $services } = useNuxtApp();
const route = useRoute();

const playlist = ref<TPlaylist>();

playlist.value = await $services.trackPlaylistService.getPlaylistById(
  route.params.id as string
);

const { currentlyPlayingPlaylist, currentlyPlayingTrack, isPlaying } =
  storeToRefs(useTrackPlaylistStore());
const { user } = storeToRefs(useAuthStore());

const onChooseTrack = (track: TTrack) => {
  currentlyPlayingPlaylist.value = playlist.value;
  currentlyPlayingTrack.value = track;
  isPlaying.value = true;
};

const onPlayPlaylist = () => {
  if (currentlyPlayingPlaylist.value?.id === playlist.value?.id) {
    isPlaying.value = !isPlaying.value;
    return;
  }
  onChooseTrack(playlist.value?.tracks[0]!);
};
</script>

<style lang="scss">
.playlists-page {
  height: 100%;
  overflow-y: auto;
}
</style>
