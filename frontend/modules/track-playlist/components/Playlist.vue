<template>
  <div class="playlist">
    <div class="playlist__title">
      <div class="playlist__type">
        {{
          playlist.type === "private" ? "Private playlist" : "Public playlist"
        }}
      </div>
      <div class="playlist__name">
        {{ favouritePlaylist ? "Favourite tracks" : playlist.name }}
      </div>
      <div class="playlist__bottom">
        <div class="playlist__author-name">
          {{ username }}<span>'s playlist</span>
        </div>
        <template v-if="playlist.trackCount">
          <div class="playlist__number-of-songs">{{ numberOfSongs }},</div>
          <div class="playlist__duration">{{ duration }}</div>
        </template>
      </div>
    </div>

    <div class="playlist__dither"></div>
    <div v-if="playlist.trackCount" class="playlist__buttons">
      <SButton
        class="playlist__play-button"
        :icon="playing && playlist.id === currentPlaylistId ? 'pause' : 'play'"
        icon-only
        :icon-size="25"
        @click="emit('playPlaylist')"
      />
      <SButton
        icon="download"
        type="text"
        icon-color="white"
        icon-only
        :icon-size="40"
      />
      <SDropdown>
        <SDropdownItem text="Add video" @click="openAddVideoModal" />
        <SDropdownItem text="Add playlist" disabled />
        <template #target>
          <SButton
            icon="add-track"
            type="text"
            icon-color="white"
            icon-only
            :icon-size="40"
          />
        </template>
      </SDropdown>
      <!-- <SInput /> -->
    </div>
    <div v-if="playlist.trackCount" class="playlist__table">
      <TrackTable :headers="headers">
        <Track
          v-for="(track, index) in playlist.tracks"
          favourite-playlist
          :track="track"
          :choosen="
            currentTrack?.id === track.id && playlist.id === currentPlaylistId
          "
          :playing="
            playing &&
            currentTrack?.id === track.id &&
            playlist.id === currentPlaylistId
          "
          :index="index"
          @click="onClickOnTrack(track)"
        />
      </TrackTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModal } from "vue-final-modal";
import type { TPlaylist, TTrack } from "../entities";
import TrackTable from "./TrackTable/index.vue";
import Track from "./TrackTable/Track.vue";
import AddPlaylistModal from "./modals/AddPlaylistModal.vue";

const emit = defineEmits(["track", "playPlaylist"]);

const { $services } = useNuxtApp();

const props = defineProps<{
  username: string;
  playlist: TPlaylist;
  currentTrack?: TTrack;
  currentPlaylistId?: string;
  playing: boolean;
  favouritePlaylist?: boolean;
}>();

const headers = [
  { title: "#" },
  { title: "Title" },
  { title: "Date added" },
  { title: "", icon: "clock" },
];

const duration = computed(() => {
  const minutes = Math.floor(props.playlist.durationSum / 60);
  const hours = Math.floor(minutes / 60);
  const seconds = props.playlist.durationSum % 60;

  if (hours < 1) {
    return `${minutes} min ${seconds < 10 ? "0" : ""}${seconds} seconds`;
  }
  return `${hours}hr ${seconds < 10 ? "0" : ""}${minutes % 60} min`;
});

const numberOfSongs = computed(() => {
  return `${props.playlist.trackCount} songs`;
});

const openAddVideoModal = () => {
  const { open, close, patchOptions } = useModal({
    component: AddPlaylistModal,
    attrs: {
      onClose() {
        close();
      },
      async onAdd(url: string) {
        patchOptions({ attrs: { loading: true } });
        await addTrack(url);
        patchOptions({ attrs: { loading: false } });
        close();
      },
      loading: false,
    },
  });
  open();
};

const addTrack = async (url: string) => {
  try {
    const result = await $services.trackPlaylistService.addTrack(
      url,
      props.playlist.id
    );
    props.playlist.tracks.push(result);
  } catch (e) {
    console.log(e);
  }
};

const onClickOnTrack = (track: TTrack) => {
  emit("track", track);
};
</script>

<style lang="scss">
.playlist {
  height: 100%;
  background: linear-gradient(#604ec1, #121212 600px);
  font-family: "Avenir Next", sans-serif;
  padding-left: 40px;
  padding-right: 40px;
  position: relative;
  z-index: 10;
  overflow-y: overlay;
  overflow-x: hidden;
  background-attachment: local;

  &::-webkit-scrollbar {
    background: transparent;
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(#b3b3b3, 0.5);
    -webkit-box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.75);
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(#b3b3b3, 0.8);
  }

  &__dither {
    height: 300px;
    width: calc(100% + 10px);
    position: absolute;
    // left: 0;
    right: -10px;
    isolation: isolate;
    z-index: -1;
    background: rgba(18, 18, 18, 30%);
  }

  &__play-button {
    margin-right: 32px;
  }

  &__buttons {
    display: flex;
    padding-top: 32px;
    width: 100%;
    z-index: 10;
  }

  &__table {
    z-index: 10;
    margin-top: 32px;
    width: 100%;
  }

  &__title {
    height: 30vh;
    display: flex;
    margin-bottom: 30px;
    flex-direction: column;
    justify-content: flex-end;
  }

  &__type {
    text-transform: uppercase;
    font-size: 16px;
  }

  &__name {
    font-size: 48px;
    font-weight: 700;
    line-height: 48px;
    margin-left: -2px;
  }

  &__bottom {
    display: flex;
    gap: 5px;
    margin-top: 20px;
  }

  &__duration {
    opacity: 0.7;
  }

  &__number-of-songs {
    opacity: 0.7;
  }

  &__author-name {
    opacity: 1;
    span {
      opacity: 0.7;
    }
  }
}
</style>
