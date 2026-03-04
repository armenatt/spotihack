import type { TUser } from "../../entities";

export const useAuthStore = defineStore("authStore", () => {
  const user = ref<TUser>();

  return {
    user,
  };
});
