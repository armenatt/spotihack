<template>
  <div class="player">
    <audio ref="audio" class="play__audio"></audio>
    <div class="player__left">
      <div class="player__track-name">
        {{ track?.name }}
      </div>
    </div>
    <div class="player__middle">
      <div class="player__controls">
        <SButton
          icon-only
          type="text"
          icon="skip-left"
          :icon-size="32"
          icon-color="white"
        />
        <SButton
          icon-only
          type="text"
          :icon="playing ? 'pause-circle' : 'play-circle'"
          icon-color="white"
          :icon-size="40"
          @click="playing ? pause() : play()"
        />
        <SButton
          icon-only
          type="text"
          icon="skip-right"
          :icon-size="32"
          icon-color="white"
        />
      </div>
      <div class="player__seek">
        <div v-if="track" class="player__time-start">
          {{ getTimeFromSeconds(currentTime) }}
        </div>
        <ProgressBar />
        <div v-if="track" class="player__time-end">
          {{ getTimeFromSeconds(track?.duration) }}
        </div>
      </div>
    </div>
    <div class="player__end">
      <div class="player__volume">
        <ProgressBar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Hls from "hls.js";
import { useAuthStore } from "~/modules/auth/adapters/store";
import type { TTrack } from "../../entities";
import ProgressBar from "./ProgressBar.vue";
import { getTimeFromSeconds } from "~/helpers/getTimeFromSeconds";

const rc = useRuntimeConfig();

const audio = useTemplateRef("audio");

const emit = defineEmits(["play", "pause", "ended"]);

const { user } = storeToRefs(useAuthStore());

const props = defineProps<{
  track?: TTrack;
  playing: boolean;
}>();

const currentTime = ref(0);

const link = computed(() => {
  return `${rc.public.cdnURL}/storage/${props.track?.id}/${props.track?.id}.m3u8`;
});

const hls = new Hls({
  xhrSetup(xhr, url) {
    xhr.withCredentials = true;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Authorization", `Bearer ${user.value.access_token}`);
  },
});

watch(
  () => props.track,
  () => {
    hls.loadSource(link.value);
  }
);

onMounted(() => {
  audio.value!.ontimeupdate = (event: Event) => {
    console.log(event);

    currentTime.value = Math.round(event.target?.currentTime);
  };
});

hls.on(Hls.Events.MANIFEST_PARSED, () => {
  hls.attachMedia(audio.value!);
  play();
});

hls.on(Hls.Events.MEDIA_ENDED, () => {
  emit("ended");
});

hls.on(Hls.Events.BUFFER_APPENDED, (event, data) => {
  console.log(data);
});

const play = () => {
  emit("play");
  audio.value?.play();
};

const pause = () => {
  emit("pause");
  audio.value?.pause();
};
</script>

<style lang="scss">
.player {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: space-between;
  align-items: center;
  font-family: "Avenir Next", sans-serif;
  padding-left: 8px;
  padding-right: 8px;

  &__seek {
    width: 100%;
    display: flex;
    align-items: center;
    color: var(--grey);
  }

  &__audio {
    display: none;
  }

  &__left {
    width: 450px;
  }

  &__track-name {
    color: var(--white);
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  &__middle {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__controls {
    display: flex;
  }
}
</style>
