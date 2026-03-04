import type { TUser } from "../../entities";

export const useAuthStore = defineStore("authStore", () => {
  const user = ref<TUser>();
  const accessToken = ref("");

  return {
    user,
    accessToken,
  };
});
