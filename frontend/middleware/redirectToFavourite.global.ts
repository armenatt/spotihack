import { useAuthStore } from "~/modules/auth/adapters/store";

export default defineNuxtRouteMiddleware((to) => {
  const { user, accessToken } = storeToRefs(useAuthStore());

  if (to.name === "index" && accessToken.value) {
    const favPlaylist = user.value?.playlists.find((p) => p.favourite);
    return navigateTo(`/playlist/${favPlaylist?.id}`);
  }
});
