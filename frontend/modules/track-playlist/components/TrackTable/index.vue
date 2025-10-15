<template>
  <div class="track-table">
    <div class="track-table__headers">
      <div v-for="header in headers" class="track-table__header">
        <SIcon
          v-if="header.icon"
          :icon-name="header.icon"
          color="grey"
          :icon-size="14"
        />
        <span v-else>{{ header.title }}</span>
      </div>
    </div>

    <div class="track-table__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  headers: { title: string; icon?: string }[];
}>();
</script>

<style lang="scss">
.track-table {
  height: 100%;
  padding-bottom: 22px;

  &__headers {
    display: grid;
    align-items: center;
    grid-template-columns: 35px 1fr 0.5fr 50px;
    padding: 14px 24px;
    border-bottom: 1px solid #6666;
    margin-bottom: 20px;
  }

  &__header {
    font-size: 14px;
    text-transform: uppercase;
    color: var(--grey);
    font-family: "Avenir Next", sans-serif;
  }
}
</style>
