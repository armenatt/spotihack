<template>
  <NuxtLink
    class="playlist-item"
    :to="
      !$route.fullPath.includes('playlist')
        ? 'playlist/' + playlist.id
        : playlist.id
    "
    exact-active-class="playlist-item--selected"
  >
    <div class="playlist-item__picture">
      <img v-if="playlist.favourite" src="assets/images/liked-songs-64.png" />
      <SButton v-else icon-only icon="music" icon-color="grey" type="text" />
    </div>
    <div class="playlist-item__text">
      <div class="playlist-item__title">
        {{ props.playlist.favourite ? "Favourite tracks" : props.title }}
      </div>
      <slot name="subtitle">
        <div class="playlist-item__subtitle">
          {{
            props.playlist.type === "private"
              ? "Private playlist"
              : "Public playlist"
          }}, {{ props.playlist.trackCount }} tracks
        </div>
      </slot>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { TPlaylist } from "~/modules/track-playlist/entities";

const props = defineProps<{
  title: string;
  subtitle?: string;
  playlist: TPlaylist;
  selected: boolean;
}>();
</script>

<style lang="scss">
.playlist-item {
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border-radius: 6px;
  text-decoration: none;

  &:hover {
    background-color: hsla(0, 0%, 100%, 0.1);
  }

  &__picture {
    background-color: var(--dark-grey);
    height: 48px;
    width: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 48px;
      height: 48px;
      border-radius: 10px;
    }
  }

  &__title {
    color: var(--white);
    font-size: 16px;
    font-family: "Avenir Next", sans-serif;
    margin-bottom: 5px;
  }

  &__subtitle {
    color: var(--light-grey);
    font-size: 14px;
    font-family: "Avenir Next", sans-serif;
  }

  &--selected {
    background-color: hsla(0, 0%, 100%, 0.1);

    &:hover {
      background-color: hsla(0, 0%, 100%, 0.2);
    }
  }
}
</style>
