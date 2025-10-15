<template>
  <div class="tracks-page">
    <Playlist
      v-if="favouriteTracks"
      favourite-playlist
      :playlist="favouriteTracks"
      :current-track="currentlyPlayingTrack"
      :playing="isPlaying"
      :username="user.username"
      @track="onChooseTrack"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/modules/auth/adapters/store";
import { Playlist } from "~/modules/track-playlist";
import { useTrackPlaylistStore } from "~/modules/track-playlist/adapters/store";
import type { TTrack } from "~/modules/track-playlist/entities";

const {
  favouriteTracks,
  currentlyPlayingPlaylist,
  currentlyPlayingTrack,
  isPlaying,
} = storeToRefs(useTrackPlaylistStore());
const { user } = storeToRefs(useAuthStore());

const onChooseTrack = (track: TTrack) => {
  currentlyPlayingPlaylist.value = favouriteTracks.value;
  currentlyPlayingTrack.value = track;
  isPlaying.value = true;
};
</script>

<style lang="scss">
.tracks-page {
  height: 100%;
}
</style>
