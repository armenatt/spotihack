import { useAuthStore } from "~/modules/auth/adapters/store";

export default defineNuxtPlugin(() => {
  const { accessToken } = storeToRefs(useAuthStore());
  accessToken.value = localStorage.accessToken || "";
});
