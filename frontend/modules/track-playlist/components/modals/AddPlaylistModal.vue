<template>
  <SModal class="add-playlist-modal" title="Add track" @close="$emit('close')">
    <SInput
      v-model="url"
      class="add-playlist-modal__input"
      label="Track YouTube URL"
      placeholder="https://www.youtube.com/watch?v=..."
    />

    <template #actions>
      <SButton
        class="add-playlist-modal__action"
        :disabled="loading || !url.length"
        type="secondary"
        @click="onAdd""
        >Add</SButton
      >
    </template>
  </SModal>
</template>

<script setup lang="ts">
const emit = defineEmits(["close", "add"]);

const props = defineProps<{
  loading: boolean;
}>();

const url = ref("");

const onAdd = () => {
  emit("add", url.value);
};
</script>

<style lang="scss">
.add-playlist-modal {
  &__input {
    padding-bottom: 14px;
  }
  &__action {
    width: 100px;
  }
}
</style>
