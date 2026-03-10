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
        v-if="playlists && !loading"
        :secondaryItems="playlists"
        :selectedPlaylistId="currentlyPlayingPlaylist?.id"
        :loading="loading"
        @add-playlist="addPlaylist"
      />
      <Menu v-else :loading="loading" @add-playlist="addPlaylist" />
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
import { ModalsContainer, useModal } from "vue-final-modal";
import { useAuthStore } from "~/modules/auth/adapters/store";
import { Player } from "~/modules/track-playlist";
import { useTrackPlaylistStore } from "~/modules/track-playlist/adapters/store";
import AddPlaylistModal from "~/modules/track-playlist/components/modals/AddPlaylistModal.vue";

const { $services } = useNuxtApp();

const loading = ref(false);

const ws = ref<WebSocket>();

const { user } = storeToRefs(useAuthStore());
const {
  currentlyPlayingPlaylist,
  currentPlaylist,
  currentlyPlayingTrack,
  isPlaying,
  playlists,
} = storeToRefs(useTrackPlaylistStore());
const { getPlaylists } = useTrackPlaylistStore();
onMounted(async () => {
  user.value = await $services.authService.profile();
  await getPlaylists();
  const websocket = new WebSocket(useRuntimeConfig().public.wsURL);
  ws.value = websocket;

  ws.value.onmessage = (event) => {
    const parsedData = JSON.parse(event.data);
    if (parsedData.eventName === "updateTrack") {
      const track = currentPlaylist.value?.tracks.find(
        (track) => track.id === parsedData.trackId
      );

      if (track && parsedData.name) {
        track.name = parsedData.name;
      }

      if (track && parsedData.duration) {
        track.duration = parsedData.duration;
      }

      if (track && parsedData.status) {
        track.status = parsedData.status;
      }
    }

    if (parsedData.eventName === "deleteTrack") {
      handleDeleteTrack(parsedData);
    }
  };
  const handleDeleteTrack = (event: any) => {
    currentPlaylist.value!.tracks = currentPlaylist.value!.tracks.filter(
      (track) => track.id !== event.id
    );
  };
});
onBeforeUnmount(() => {
  ws.value?.close();
});

const nextTrack = computed(() => {
  const index =
    currentlyPlayingPlaylist.value?.tracks.findIndex(
      (track) => track.id === currentlyPlayingTrack.value?.id
    ) || 0;

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

const addPlaylist = () => {
  const { open, close, patchOptions } = useModal({
    component: AddPlaylistModal,
    attrs: {
      onClose() {
        close();
      },
      async onAdd(name: string) {
        patchOptions({ attrs: { loading: true } });
        const result = await $services.trackPlaylistService.createPlaylist(
          name
        );
        await getPlaylists();
        navigateTo(`${result.id}`);
        patchOptions({ attrs: { loading: false } });
        close();
      },
      loading: false,
    },
  });
  open();
};

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
  justify-content: space-between;
  height: 100%;

  &__header {
    min-height: 64px;
  }

  &__center {
    display: flex;
    padding: 0 8px;
    gap: 8px;
    height: calc(100% - var(--player-height));
  }

  &__player {
    min-height: var(--player-height);
  }

  &__content {
    width: 100%;
    background-color: var(--blackish);
    overflow-y: hidden;
    border-radius: 10px;
    color: var(--white);
    height: 100%;
  }
}
</style>
