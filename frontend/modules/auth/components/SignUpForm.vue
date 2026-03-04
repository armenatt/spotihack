<template>
  <div class="sign-up">
    <h1 class="sign-up__label">Sign Up</h1>
    <SInput
      v-model="email"
      :error="errorMsg"
      type="email"
      label="Email"
      placeholder="Email"
    />
    <SInput v-model="username" label="Username" placeholder="Username" />
    <SInput
      v-model="password"
      label="Password"
      placeholder="Password"
      type="password"
    />
    <SInput
      v-model="passwordConfirm"
      label="Confirm Password"
      placeholder="Confirm password"
      type="password"
    />
    <SButton :disabled="!valid" @click="signUp">Sign Up</SButton>
    <SLink to="/login">Already have an account?</SLink>
  </div>
</template>

<script setup lang="ts">
import type { AxiosError } from "axios";

const email = ref("");
const name = ref("");
const username = ref("");
const password = ref("");
const passwordConfirm = ref("");

const errorMsg = ref("");
const firstTry = ref(false);

const { $services } = useNuxtApp();

const valid = computed(() => {
  return (
    passwordsMatch.value &&
    !!email.value.length &&
    !!username.value.length &&
    !firstTry.value
  );
});

const passwordsMatch = computed(() => {
  return (
    password.value === passwordConfirm.value &&
    !!password.value.length &&
    passwordConfirm.value.length
  );
});

watch(
  () => email.value,
  () => {
    firstTry.value = false;
    errorMsg.value = "";
  }
);

const signUp = async () => {
  try {
    await $services.authService.register(
      password.value,
      passwordConfirm.value,
      username.value,
      email.value
    );
    await navigateTo("/login");
  } catch (err) {
    const error = err as AxiosError;
    //TODO: add normal error handling later
    if (error.response?.data?.message === "Email already exists") {
      errorMsg.value = "Email already exists";
      firstTry.value = true;
    }
  }
};
</script>

<style lang="scss">
.sign-up {
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
