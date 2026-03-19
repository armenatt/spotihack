<template>
  <div class="login-form" @keypress.enter="signIn">
    <h1 class="login-form__label">Login to Spotihack</h1>
    <SInput
      v-model="email"
      type="email"
      :error="errorMessage"
      label="Email"
      placeholder="Email"
    />
    <SInput
      v-model="password"
      label="Password"
      placeholder="Password"
      :error="!!errorMessage"
      type="password"
    />
    <SButton :disabled="!valid" @click="signIn">Login</SButton>
    <SLink to="/sign-up">I don't have an account</SLink>
  </div>
</template>

<script setup lang="ts">
import { AxiosError } from "axios";
import { useAuthStore } from "../adapters/store";

const email = ref<string>("");
const password = ref<string>("");
const error = ref(false);

const { $services } = useNuxtApp();

const { user, accessToken } = storeToRefs(useAuthStore());

const valid = computed(() => {
  return !!email.value.length && !!password.value.length;
});

const errorMessage = computed(() => {
  return error.value ? "Invalid credentials" : "";
});

const signIn = async () => {
  try {
    const result = await $services.authService.login(
      email.value,
      password.value
    );

    if (result.data.accessToken) {
      user.value = result.data;
      localStorage.setItem("accessToken", result.data.accessToken);
      accessToken.value = result.data.accessToken;
      const favPlaylist = user.value.playlists.find((p) => p.favourite);
      await navigateTo("/playlist/" + favPlaylist?.id);
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.data?.message?.length) {
        error.value = true;
      }
    }
  }
};

watch([() => email.value, () => password.value], () => {
  error.value = false;
});
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
