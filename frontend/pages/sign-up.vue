<template>
  <div class="auth-page">
    <SignUpForm />
  </div>
</template>

<script setup lang="ts">
import { SignUpForm } from "~/modules/auth";

definePageMeta({
  layout: "auth",
});
</script>
