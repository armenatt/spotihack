<template>
  <div class="main-page">main page</div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/modules/auth/adapters/store";

const { user } = storeToRefs(useAuthStore());

definePageMeta({
  middleware: "auth",
});
</script>
