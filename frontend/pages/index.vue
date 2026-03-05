<script lang="ts" setup>
import { useAuthStore } from "~/modules/auth/adapters/store";

const { $services } = useNuxtApp();
const { user } = storeToRefs(useAuthStore());
user.value = await $services.authService.profile();
const favPlaylist = user.value?.playlists.find((p) => p.favourite);
navigateTo(`/playlist/${favPlaylist?.id}`);
</script>
