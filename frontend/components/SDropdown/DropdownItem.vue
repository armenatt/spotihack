<template>
  <div :class="['s-dropdown-item', { 's-dropdown-item--disabled': disabled }]">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  icon?: string;
  text: string;
  disabled?: boolean;
}>();
</script>

<style lang="scss">
.s-dropdown-item {
  height: 40px;
  color: var(--grey);
  border-radius: 2px;
  padding: 8px;
  display: flex;
  align-items: center;
  cursor: default;
  &:hover {
    background-color: hsla(0, 0%, 100%, 0.1);
  }

  &--disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
</style>
