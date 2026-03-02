import { useAuthStore } from "~/modules/auth/adapters/store";

export default defineNuxtRouteMiddleware((to) => {
  const { user } = storeToRefs(useAuthStore());

  if (!user.value && to.path !== "/login") {
    return navigateTo("/login");
  }
});
