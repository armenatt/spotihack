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
          {{ username }}<span>'s playlist,</span>
        </div>
        <div class="playlist__number-of-songs">{{ numberOfSongs }},</div>
        <div class="playlist__duration">{{ duration }}</div>
      </div>
    </div>

    <div class="playlist__dither"></div>
    <div class="playlist__buttons">
      <SButton
        class="playlist__play-button"
        :icon="playing ? 'pause' : 'play'"
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
      <SButton
        icon="add-track"
        type="text"
        icon-color="white"
        icon-only
        :icon-size="40"
      />
      <!-- <SInput /> -->
    </div>
    <div class="playlist__table">
      <TrackTable :headers="headers">
        <Track
          v-for="(track, index) in playlist.tracks"
          favourite-playlist
          :track="track"
          :choosen="currentTrack?.id === track.id"
          :playing="playing && currentTrack?.id === track.id"
          :index="index"
          @click="onClickOnTrack(track)"
        />
      </TrackTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TPlaylist, TTrack } from "../entities";
import TrackTable from "./TrackTable/index.vue";
import Track from "./TrackTable/Track.vue";

const emit = defineEmits(["track", "playPlaylist"]);

const props = defineProps<{
  username: string;
  playlist: TPlaylist;
  currentTrack?: TTrack;
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
  const minutes = Math.round(props.playlist.durationSum / 60);
  const hours = Math.round(minutes / 60);

  return `${hours}hr ${minutes % 60 < 10 ? "0" : ""}${minutes % 60} min`;
});

const numberOfSongs = computed(() => {
  return `${props.playlist.trackCount} songs`;
});

const onClickOnTrack = (track: TTrack) => {
  emit("track", track);
};
</script>

<style lang="scss">
.playlist {
  height: 100%;
  background: linear-gradient(#604ec1, #121212 70%);
  background-repeat: repeat-y;
  font-family: "Avenir Next", sans-serif;
  padding-left: 40px;
  padding-right: 40px;
  position: relative;
  z-index: 10;

  &__dither {
    height: 300px;
    width: 100%;
    position: absolute;
    left: 0;
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
