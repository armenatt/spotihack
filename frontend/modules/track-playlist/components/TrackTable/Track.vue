<template>
  <div :class="{ track: true, 'track--playing': choosen }">
    <div class="track__first">
      <div v-if="!playing" class="track__number">
        {{ index + 1 }}
      </div>
      <div v-else class="track__visualizer">
        <SIcon
          icon-name="visualizer"
          :color="playing ? 'green' : 'white'"
          :size="22"
        />
      </div>
    </div>
    <div class="track__title" :title="track.name">
      {{ track.name }}
    </div>
    <div class="track__date-added">
      {{ dayjs(track.createdAt).format("YYYY-MM-DD") }}
    </div>
    <div class="track__duration">{{ duration }}</div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import type { TTrack } from "../../entities";
import { getTimeFromSeconds } from "~/helpers/getTimeFromSeconds";

const props = defineProps<{
  index: number;
  track: TTrack;
  choosen: boolean;
  playing: boolean;
  favouritePlaylist?: boolean;
}>();

const duration = computed(() => {
  return getTimeFromSeconds(props.track.duration);
});
</script>

<style lang="scss">
.track {
  $self: &;
  padding: 14px 24px;
  display: grid;
  grid-template-columns: 35px 1fr 0.5fr 50px;
  font-family: "Avenir Next", sans-serif;
  height: 56px;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  color: var(--grey);

  &:focus-within,
  &:hover {
    background-color: hsla(0, 0%, 100%, 0.1);
    border-radius: 5px;
  }

  &--playing {
    #{$self}__title {
      color: var(--green);
    }
  }

  &__visualizer {
    position: relative;
    height: 22px;
    .s-icon {
      max-height: 22px;
      left: -5px;
      bottom: 7px;
      position: absolute;
    }
  }

  &__title {
    color: var(--white);
    font-size: 16px;
    padding-right: 40px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__number {
    color: var(--grey);
  }
}
</style>
