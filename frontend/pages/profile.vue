<template>
  <div class="profile-page">
    <pre>
      {{ user }}
    </pre>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/modules/auth/adapters/store";

const { user } = storeToRefs(useAuthStore());
</script>
