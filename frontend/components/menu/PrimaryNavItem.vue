<template>
  <NuxtLink :to="props.to" class="primary-nav-item">
    <SIcon :icon-name="icon" />
    <div class="primary-nav-item__label">{{ props.label }}</div>
  </NuxtLink>
</template>

<script setup lang="ts">
const route = useRoute();

const props = defineProps<{
  label: string;
  icon: string;
  iconActive: string;
  to: string;
}>();

const icon = computed(() =>
  route.path === props.to ? props.iconActive : props.icon
);
</script>

<style lang="scss">
.primary-nav-item {
  $self: &;
  text-decoration: none;
  display: flex;
  gap: 16px;
  padding: 4px 12px;
  height: 50px;
  align-items: center;
  cursor: pointer;

  &__label {
    font-size: 16px;
    font-family: "Avenir Next", sans-serif;
    color: var(--light-grey);
  }

  .nuxt-icon svg {
    font-size: 26px;
    color: var(--light-grey);
  }

  &:hover {
    #{$self}__label {
      color: var(--white);
      transition: 0.5s ease-in-out;
    }

    .nuxt-icon svg {
      transition: 0.5s ease-in-out;
      color: var(--white);
    }
  }

  &.router-link-exact-active,
  &.router-link-active {
    #{$self}__label {
      color: var(--white);
      transition: 0.5s ease-in-out;
    }

    .nuxt-icon svg {
      transition: 0.5s ease-in-out;
      color: var(--white);
    }
  }
}
</style>
