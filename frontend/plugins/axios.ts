import axios from "axios";
import { useAuthStore } from "~/modules/auth/adapters/store";

export default defineNuxtPlugin(() => {
  const rc = useRuntimeConfig();
  const { user } = storeToRefs(useAuthStore());
  axios.defaults.baseURL = rc.public.baseURL;
  axios.defaults.headers.common.Authorization = `Bearer ${user.value.access_token}`;
});
