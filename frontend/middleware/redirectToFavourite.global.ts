import { useAuthStore } from "~/modules/auth/adapters/store";

export default defineNuxtRouteMiddleware((to) => {
  const { user } = storeToRefs(useAuthStore());

  if (to.path === "/" && user.value) {
    const favPlaylist = user.value.playlists.find((p) => p.favourite);
    return navigateTo(`/playlist/${favPlaylist?.id}`);
  }
});
