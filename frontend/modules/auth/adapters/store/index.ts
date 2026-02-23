import type { TUser } from "../../entities";

export const useAuthStore = defineStore(
  "authStore",
  () => {
    const user = ref<TUser>();

    return {
      user,
    };
  },
  {
    persist: {
      storage: localStorage,
      afterHydrate: (context) => {
        context.store.$hydrate();
      },
    },
  }
);
