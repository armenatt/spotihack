<template>
  <div
    class="secondary-nav-item"
    :class="{ 'secondary-nav-item--selected': props.selected }"
  >
    <div class="secondary-nav-item__picture">
      <img :src="picture" alt="Not found" />
    </div>
    <div class="secondary-nav-item__text">
      <div class="secondary-nav-item__title">
        {{ props.title }}
      </div>
      <slot name="s-subtitle">
        <div v-if="props.subtitle" class="secondary-nav-item__subtitle">
          {{ props.subtitle }}
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle?: string;
  pictureLink?: string;
  selected: boolean;
}>();

const picture = computed(() => {
  return props.pictureLink || "_nuxt/assets/images/empty_avatar.jpg";
});
</script>

<style lang="scss">
.secondary-nav-item {
  padding: 8px;
  display: flex;
  gap: 10px;
  cursor: pointer;
  border-radius: 6px;

  &__picture img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
  }

  &__title {
    color: var(--white);
    font-size: 16px;
    font-family: "Avenir Next", sans-serif;
    margin-bottom: 5px;
  }

  &__subtitle {
    color: var(--light-grey);
    font-size: 12px;
    font-family: "Avenir Next", sans-serif;
  }

  &:hover {
    background-color: rgba(var(--highlight), 0.06);
  }

  &--selected {
    background-color: rgba(var(--highlight), 0.1);

    &:hover {
      background-color: rgba(var(--highlight), 0.2);
    }
  }
}
</style>
