<template>
  <NuxtLink class="s-link" :to="props.to">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  to?: string;
}>();
</script>

<style lang="scss">
.s-link {
  cursor: pointer;
  color: var(--white);
  text-decoration: underline;
  user-select: none;
  font-family: "AvenirNext", sans-serif;
}
</style>
