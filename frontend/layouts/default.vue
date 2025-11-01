<template>
  <div class="default-layout">
    <div class="default-layout__header">
      <SButton
        iconOnly
        icon="profile-outline"
        :iconSize="30"
        type="text"
        iconColor="white"
        @click="navigateTo('/profile')"
      />
    </div>
    <div class="default-layout__center">
      <Menu :secondaryItems="playlists" />
      <div class="default-layout__content">
        <NuxtPage />
      </div>
    </div>
    <div class="default-layout__player">
      <Player
        :track="currentlyPlayingTrack"
        :playing="isPlaying"
        :disabledNext="!nextTrack"
        :disabledPrev="!prevTrack"
        @pause="isPlaying = false"
        @play="isPlaying = true"
        @next="onNext"
        @prev="onPrev"
        @ended="onTrackEnded"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Player } from "~/modules/track-playlist";
import { useTrackPlaylistStore } from "~/modules/track-playlist/adapters/store";
import type { TPlaylist } from "~/modules/track-playlist/entities";

const { $services } = useNuxtApp();

const playlists = ref<TPlaylist[]>();

playlists.value = await $services.trackPlaylistService.getPlaylistList();

const { currentlyPlayingPlaylist, currentlyPlayingTrack, isPlaying } =
  storeToRefs(useTrackPlaylistStore());

const nextTrack = computed(() => {
  const index = currentlyPlayingPlaylist.value?.tracks.findIndex(
    (track) => track.id === currentlyPlayingTrack.value?.id
  );

  if (index < 0) {
    return undefined;
  }
  return currentlyPlayingPlaylist.value?.tracks[index + 1];
});

const prevTrack = computed(() => {
  const index = currentlyPlayingPlaylist.value?.tracks.findIndex(
    (track) => track.id === currentlyPlayingTrack.value?.id
  );

  if (index === -1 || !index) {
    return undefined;
  }
  return currentlyPlayingPlaylist.value?.tracks[index - 1];
});

const onTrackEnded = () => {
  currentlyPlayingTrack.value = nextTrack.value;
};

const onNext = () => {
  currentlyPlayingTrack.value = nextTrack.value;
};

const onPrev = () => {
  currentlyPlayingTrack.value = prevTrack.value;
};
</script>

<style lang="scss">
.default-layout {
  display: grid;
  // flex-direction: column;
  background-color: black;
  min-height: 100vh;
  height: 100vh;
  grid-template-areas:
    "header header header"
    "center center center"
    "player player player";
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr auto;

  &__header {
    min-height: 64px;
    grid-area: header;
  }

  &__center {
    display: flex;
    padding: 0 8px;
    gap: 8px;
    overflow-y: auto;
    grid-area: center;
  }

  &__player {
    min-height: 88px;
    grid-area: player;
  }

  &__content {
    width: 100%;
    background-color: var(--blackish);
    overflow-y: hidden;
    border-radius: 10px;
    color: var(--white);
  }
}
</style>
