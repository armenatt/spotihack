<template>
  <div class="playlists-page"></div>
</template>

<script setup lang="ts">
import { Playlist } from "~/modules/track-playlist";

const playlists = ref({
  name: "Playlistprikol",
  authorName: "Armenat",
  numberOfSongs: 20,
});
</script>

<style lang="scss">
.playlists-page {
  height: 100%;
}
</style>
