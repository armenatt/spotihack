<template>
  <div class="login-page">
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
import { LoginForm } from "~/modules/auth";

definePageMeta({
  layout: "auth",
});
</script>
