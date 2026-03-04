import { useAuthStore } from "~/modules/auth/adapters/store";

export default defineNuxtRouteMiddleware(async (to) => {
  const { user } = storeToRefs(useAuthStore());

  if (user.value?.accessToken) {
    await navigateTo("/login");
  }
});
