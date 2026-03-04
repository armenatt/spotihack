import { useAuthStore } from "~/modules/auth/adapters/store";

export default defineNuxtRouteMiddleware(async (to) => {
  const { accessToken } = storeToRefs(useAuthStore());

  if (
    !accessToken.value.length &&
    !localStorage.accessToken &&
    to.path !== "login" &&
    to.path !== "sign-up"
  ) {
    return navigateTo("/login");
  }
});
