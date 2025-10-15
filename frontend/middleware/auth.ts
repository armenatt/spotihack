import { useAuthStore } from "~/modules/auth/adapters/store";

export default defineNuxtRouteMiddleware(() => {
  const { user } = storeToRefs(useAuthStore());

  if (!user.value) {
    return navigateTo("/login");
  }
});
