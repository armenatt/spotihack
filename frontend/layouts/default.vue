<template>
  <div class="default-layout">
    <div class="default-layout__top">
      <Menu />
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

const { $services } = useNuxtApp();

await $services.trackPlaylistService.getFavouriteTracks();

const { currentlyPlayingPlaylist, currentlyPlayingTrack, isPlaying } =
  storeToRefs(useTrackPlaylistStore());

const nextTrack = computed(() => {
  const index = currentlyPlayingPlaylist.value?.tracks.findIndex(
    (track) => track.id === currentlyPlayingTrack.value?.id
  );

  if (index === -1) {
    return undefined;
  }
  return currentlyPlayingPlaylist.value?.tracks[index + 1];
});

const prevTrack = computed(() => {
  const index = currentlyPlayingPlaylist.value?.tracks.findIndex(
    (track) => track.id === currentlyPlayingTrack.value?.id
  );

  if (index === -1) {
    return undefined;
  }
  return currentlyPlayingPlaylist.value?.tracks[index - 1];
});

const disablePrev = computed(() => {
  return !nextTrack.value;
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
  display: flex;
  flex-direction: column;
  background-color: black;
  height: 100vh;

  &__top {
    display: flex;
    padding: 8px 8px 0;
    gap: 8px;
    overflow-y: auto;
  }

  &__player {
    min-height: 88px;
  }

  &__content {
    display: flex;
    width: 100%;
    background-color: var(--blackish);
    // padding: 14px;
    overflow-y: auto;
    border-radius: 10px;
    color: var(--white);
  }
}
</style>
