<template>
  <div class="s-icon">
    <nuxt-icon
      :style="{ 'font-size': size + 'px', color: `var(--${color})` }"
      :name="props.iconName"
      filled
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    iconName: string;
    color?: string;
    size?: number;
  }>(),
  { color: "white", size: 20 }
);
</script>

<style lang="scss">
.s-icon {
}
</style>
