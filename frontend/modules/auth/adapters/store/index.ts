export const useAuthStore = defineStore(
  "authStore",
  () => {
    const user = ref();
    return {
      user,
    };
  },
  {
    persist: true,
  }
);
