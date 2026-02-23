<template>
  <div class="menu">
    <nav class="menu__nav">
      <PlaylistItem
        v-for="item in props?.secondaryItems"
        :title="item.favourite ? 'Favourite tracks' : item.name"
        :playlist="item"
        :selected="selectedPlaylistId === item.id"
      />
      <div v-if="!props.secondaryItems?.length" class="menu__empty">
        NET NICHEGO
      </div>
      <!-- </div> -->
    </nav>
  </div>
</template>

<script setup lang="ts">
import PlaylistItem from "./PlaylistItem.vue";
import type { TPlaylist } from "~/modules/track-playlist/entities";

const props = defineProps<{
  secondaryItems?: TPlaylist[];
  selectedPlaylistId?: string;
}>();
</script>

<style lang="scss">
.menu {
  resize: horizontal;
  width: 420px;
  grid-area: menu;

  &__nav {
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 8px;
    align-items: stretch;

    background-color: var(--blackish);
    padding: 8px;
    border-radius: 10px;
    height: 100%;
    overflow-y: scroll;
  }

  &__primary-nav {
    background-color: var(--blackish);
    padding: 8px 12px;
    border-radius: 10px;
  }

  ::-webkit-scrollbar {
    opacity: 0;
  }

  ::-webkit-scrollbar-thumb {
    opacity: 0;
    background: rgba(var(--white), 0.1);
    -webkit-box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.75);
  }

  &__secondary-nav {
  }

  &__empty {
    color: var(--white);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
