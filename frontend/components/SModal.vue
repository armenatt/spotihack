<template>
  <VueFinalModal class="s-modal">
    <div class="s-modal__header">
      <div class="s-modal__title">
        {{ title }}
      </div>
      <SIcon
        icon-name="close"
        color="white"
        :size="20"
        @click="emit('close')"
      />
    </div>
    <div class="s-modal__content">
      <slot />
    </div>
    <div class="s-modal__actions">
      <slot name="actions" />
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from "vue-final-modal";

const emit = defineEmits(["close"]);

const props = defineProps<{
  title: string;
  width?: string;
  height?: string;
}>();
</script>

<style lang="scss">
.vfm__content {
  min-width: 400px;
}
.s-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 400px;
  font-family: "AvenirNext", sans-serif;

  &__title {
    font-size: 24px;
    color: white;
  }

  &__content {
    padding-left: 24px;
    padding-right: 24px;
    background-color: var(--dark-grey);
  }

  &__header {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding: 24px;
    width: 100%;
    background-color: var(--dark-grey);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    background-color: var(--dark-grey);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding: 8px 24px 24px 24px;
  }
}
</style>
