<template>
  <SModal class="add-playlist-modal" title="Add Playlist" @close="$emit('close')">
    <SInput
      v-model="name"
      class="add-playlist-modal__input"
      label="Playlist name"
      placeholder="Eminem playlist"
    />

    <template #actions>
      <SButton
        class="add-playlist-modal__action"
        :disabled="loading || !name.length"
        type="secondary"
        @click="onAdd"
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

const name = ref("");

const onAdd = () => {
  emit("add", name.value);
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
