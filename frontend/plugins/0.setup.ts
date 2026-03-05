import { useAuthStore } from "~/modules/auth/adapters/store";

export default defineNuxtPlugin(async () => {
  const { $services } = useNuxtApp();
  const { accessToken } = storeToRefs(useAuthStore());
  accessToken.value = localStorage.accessToken || "";
});
