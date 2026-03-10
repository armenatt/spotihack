import type { TUser } from "../../entities";

export const useAuthStore = defineStore("authStore", () => {
  const user = ref<TUser | null>();
  const accessToken = ref<string | null>("");

  return {
    user,
    accessToken,
  };
});
