<template>
  <div class="login-form" @keypress.enter="signIn">
    <h1 class="login-form__label">Login to Spotihack</h1>
    <SInput v-model="email" label="Email" placeholder="Email" />
    <SInput
      v-model="password"
      label="Password"
      placeholder="Password"
      type="password"
    />
    <SButton @click="signIn">Login</SButton>
    <SLink to="/sign-up">I don't have an account</SLink>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../adapters/store";

const email = ref<string>("");
const password = ref<string>("");
const { $services } = useNuxtApp();

const { user } = storeToRefs(useAuthStore());
const signIn = async () => {
  const result = await $services.authService.login(email.value, password.value);

  if (result.data.accessToken) {
    user.value = result.data;
    const favPlaylist = user.value.playlists.find((p) => p.favourite);
    await navigateTo(`/playlist/${favPlaylist?.id}`);
  }
};
</script>

<style lang="scss">
.login-form {
  padding-top: 100px;
  display: flex;
  gap: 15px;
  flex-direction: column;
  align-items: center;
  width: 325px;

  &__label {
    color: var(--white);
    margin: 50px 0;
    font-family: "AvenirNext", sans-serif;
  }
}
</style>
