<template>
  <div class="main-page">
    <audio class="audio" ref="audio" id="audio" controls />
  </div>
</template>

<script setup lang="ts">
import Hls from "hls.js";
import { useAuthStore } from "~/modules/auth/adapters/store";

const { user } = storeToRefs(useAuthStore());

definePageMeta({
  middleware: "auth",
});

const audio = useTemplateRef("audio");

const hls = new Hls({
  xhrSetup(xhr, url) {
    xhr.withCredentials = true;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Authorization", `Bearer ${user.value.access_token}`);
  },
});

hls.loadSource(
  "http://localhost:9999/storage/153b5f6a-2595-4636-bcd5-0b43bbcb9fa3/153b5f6a-2595-4636-bcd5-0b43bbcb9fa3.m3u8"
);
hls.on(Hls.Events.MEDIA_ATTACHED, function () {
  console.log("video and hls.js are now bound together !");
});
hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
  console.log(
    "manifest loaded, found " + data.levels.length + " quality level"
  );
  hls.attachMedia(audio.value!);
});
</script>
