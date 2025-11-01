<template>
  <div class="player" @keyboard.space="playing ? pause() : play()">
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
          :disabled="!track"
          :icon-size="32"
          icon-color="white"
          @click="onPrev"
        />
        <SButton
          icon-only
          type="text"
          :icon="playing ? 'pause-circle' : 'play-circle'"
          icon-color="white"
          :disabled="!track"
          :icon-size="40"
          @keyboard.space="playing ? pause() : play()"
          @click="playing ? pause() : play()"
        />
        <SButton
          icon-only
          type="text"
          icon="skip-right"
          :icon-size="32"
          :disabled="disabledNext || !track"
          icon-color="white"
          @click="emit('next')"
        />
      </div>
      <div class="player__seek">
        <div v-if="track" class="player__time-start">
          {{ getTimeFromSeconds(Math.floor(currentTime)) }}
        </div>
        <ProgressBar
          v-model="normalizedTime"
          @mousepressed="mouseDown = true"
          @mousereleased="onMouseReleased"
        />
        <div v-if="track" class="player__time-end">
          {{ getTimeFromSeconds(track?.duration) }}
        </div>
      </div>
    </div>
    <div class="player__end">
      <div class="player__volume">
        <ProgressBar v-model="volume" />
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

const emit = defineEmits(["play", "pause", "ended", "next", "prev"]);

const { user } = storeToRefs(useAuthStore());

const props = defineProps<{
  track?: TTrack;
  playing: boolean;
  disabledNext: boolean;
  disabledPrev: boolean;
}>();

const currentTime = ref(0);
const volume = ref(localStorage.volume || 100);
const mouseDown = ref(false);

const link = computed(() => {
  return `${rc.public.cdnURL}/storage/${props.track?.id}/${props.track?.id}.m3u8`;
});

const normalizedTime = computed({
  get() {
    return (currentTime.value / (props.track?.duration ?? 1)) * 100;
  },
  set(value) {
    currentTime.value = (value / 100) * (props.track?.duration ?? 1);
    // currentTime.value = value;
  },
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

watch(
  () => volume.value,
  () => {
    audio.value!.volume = volume.value / 100;
    localStorage.volume = volume.value;
  }
);

watch(
  () => props.playing,
  () => {
    if (props.playing) {
      play();
    } else {
      pause();
    }
  }
);

onMounted(() => {
  audio.value!.ontimeupdate = computedFunc.value;
  audio.value!.onpause = () => {
    emit("pause");
  };
  audio.value!.onplay = () => {
    emit("play");
  };
});

const computedFunc = computed(() => {
  if (!mouseDown.value) {
    return (event: Event) => {
      currentTime.value = event.target?.currentTime;
    };
  } else {
    return null;
  }
});

watch(
  () => mouseDown.value,
  () => {
    audio.value!.ontimeupdate = computedFunc.value;
  }
);

hls.on(Hls.Events.MANIFEST_PARSED, () => {
  hls.attachMedia(audio.value!);
  play();
});

hls.on(Hls.Events.MEDIA_ENDED, () => {
  emit("ended");
});

hls.on(Hls.Events.BUFFER_APPENDED, (event, data) => {
  // console.log(data);
});

const play = () => {
  emit("play");
  audio.value?.play();
};

const pause = () => {
  emit("pause");
  audio.value?.pause();
};

const onPrev = () => {
  if (currentTime.value > 1.4 || props.disabledPrev) {
    audio.value!.currentTime = 0;
    return;
  }
  emit("prev");
};

const onMouseReleased = () => {
  if (mouseDown.value) {
    audio.value!.currentTime = currentTime.value;
  }
  mouseDown.value = false;
};
</script>

<style lang="scss">
.player {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  // justify-content: space-between;
  align-items: center;
  font-family: "Avenir Next", sans-serif;
  padding-left: 8px;
  padding-right: 8px;

  &__end {
    display: flex;
    justify-content: flex-end;
  }

  &__seek {
    width: 100%;
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 12px;
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

  &__volume {
    width: 100px;
  }
}
</style>
