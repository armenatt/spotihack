import { AuthApi } from "~/modules/auth/adapters/api";
import { useAuthStore } from "~/modules/auth/adapters/store";
import { AuthService } from "~/modules/auth/services";
import { TrackPlaylistApi } from "~/modules/track-playlist/adapters/api";
import { useTrackPlaylistStore } from "~/modules/track-playlist/adapters/store";
import { TrackPlaylistService } from "~/modules/track-playlist/services";

export default defineNuxtPlugin((nuxtApp) => {
  const authApi = new AuthApi();
  const authStore = useAuthStore();
  const authService = new AuthService(authApi, authStore);
  const trackPlaylistApi = new TrackPlaylistApi();
  const trackPlaylistStore = useTrackPlaylistStore();
  const trackPlaylistService = new TrackPlaylistService(
    trackPlaylistApi,
    trackPlaylistStore
  );

  return {
    provide: {
      services: {
        authService,
        trackPlaylistService,
      },
    },
  };
});
