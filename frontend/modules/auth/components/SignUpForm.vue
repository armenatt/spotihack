<template>
  <div class="sign-up">
    <h1 class="sign-up__label">Sign Up</h1>
    <SInput v-model="email" label="Email" placeholder="Email" />
    <SInput v-model="name" label="Name" placeholder="Name" />
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
    <SButton @click="signUp">Sign Up</SButton>
    <SLink to="/login">Already have an account?</SLink>
  </div>
</template>

<script setup lang="ts">
const email = ref("");
const name = ref("");
const password = ref("");
const passwordConfirm = ref("");

const signUp = () => {
  console.log("sign up");
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
