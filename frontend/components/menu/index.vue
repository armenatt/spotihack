<template>
  <div class="menu">
    <div class="menu__header">
      <span class="menu__header-title"> Playlists </span>
      <SButton
        type="dark"
        icon="plus"
        icon-color="white"
        @click="$emit('add-playlist')"
        >Add playlist</SButton
      >
    </div>
    <nav class="menu__nav" ref="nav">
      <template v-if="props.secondaryItems?.length && !loading">
        <PlaylistItem
          v-for="item in props?.secondaryItems"
          :title="item.favourite ? 'Favourite tracks' : item.name"
          :playlist="item"
          :skeleton="loading"
          :selected="selectedPlaylistId === item.id"
        />
      </template>
      <div v-else-if="loading" class="menu__empty">NET NICHEGO</div>
      <!-- </div> -->
    </nav>
    <div class="menu__footer">
      <SButton type="dark" icon-color="white" @click="logout">Log out</SButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/modules/auth/adapters/store";
import SButton from "../SButton.vue";
import PlaylistItem from "./PlaylistItem.vue";
import type { TPlaylist } from "~/modules/track-playlist/entities";

defineEmits(["add-playlist"]);

const { user, accessToken } = storeToRefs(useAuthStore());

const nav = useTemplateRef("nav");
const route = useRoute();

const props = defineProps<{
  secondaryItems?: Omit<TPlaylist, "tracks">[];
  selectedPlaylistId?: string;
  loading: boolean;
}>();

const logout = () => {
  navigateTo("/login");
  user.value = null;
  accessToken.value = "";
  localStorage.accessToken = "";
};

onMounted(() => {
  nav.value?.querySelector(`[data-id="${route.params.id}"]`)?.scrollIntoView();
});
</script>

<style lang="scss">
.menu {
  resize: horizontal;
  width: 420px;
  height: calc(100% - var(--player-height) - 6px);
  font-family: "Avenir Next", sans-serif;

  &__nav {
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
    background-color: var(--blackish);
    padding: 8px;
    border-radius: 10px;
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

  &__footer {
    display: flex;
    justify-content: flex-end;
    padding: 8px;
  }

  &__header {
    display: flex;
    align-items: center;
    padding: 8px;
  }

  &__header-title {
    margin-right: auto;
    color: white;
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
