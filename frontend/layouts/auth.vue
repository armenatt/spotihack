<template>
  <div class="auth-layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
const { $services } = useNuxtApp();

// if ($services.authService.User) {
//   navigateTo("/");
// }
</script>

<style lang="scss">
.auth-layout {
  height: 100vh;
  background-color: var(--blackish);
  display: flex;
  justify-content: center;
}
</style>
