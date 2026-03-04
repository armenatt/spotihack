<template>
  <div class="default-layout">
    <!-- <div class="default-layout__header">
      <SButton
        iconOnly
        icon="profile-outline"
        :iconSize="30"
        type="text"
        iconColor="white"
        @click="navigateTo('/profile')"
      />
    </div> -->
    <div class="default-layout__center">
      <Menu
        :secondaryItems="playlists"
        :selectedPlaylistId="currentlyPlayingPlaylist?.id"
      />
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
    <ModalsContainer />
  </div>
</template>

<script setup lang="ts">
import { ModalsContainer } from "vue-final-modal";
import { Player } from "~/modules/track-playlist";
import { useTrackPlaylistStore } from "~/modules/track-playlist/adapters/store";
import type { TPlaylist } from "~/modules/track-playlist/entities";

const { $services } = useNuxtApp();

const playlists = ref<Omit<TPlaylist, "tracks">[]>();
const ws = ref<WebSocket>();

const {
  currentlyPlayingPlaylist,
  currentlPlaylist,
  currentlyPlayingTrack,
  isPlaying,
} = storeToRefs(useTrackPlaylistStore());

onMounted(async () => {
  playlists.value = await $services.trackPlaylistService.getPlaylistList();
  const websocket = new WebSocket(useRuntimeConfig().public.wsURL);
  ws.value = websocket;

  ws.value.onmessage = (event) => {
    const parsedData = JSON.parse(event.data);
    if (parsedData.eventName === "updateTrack") {
      const track = currentlPlaylist.value?.tracks.find(
        (track) => track.id === parsedData.trackId
      );

      if (track && parsedData.name) {
        track.name = parsedData.name;
      }

      if (track && parsedData.duration) {
        track.duration = parsedData.duration;
      }
    }
  };
});
onBeforeUnmount(() => {
  ws.value?.close();
});

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

watch(
  () => currentlyPlayingTrack.value,
  () => {
    useHead({ title: currentlyPlayingTrack.value?.name });
  }
);

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
