import axios, { type AxiosResponse } from "axios";
import { useAuthStore } from "~/modules/auth/adapters/store";

async function onRejected(response: AxiosResponse) {
  const { user } = storeToRefs(useAuthStore());
  const { $services } = useNuxtApp();
  if (response.status === 401 && user.value?.accessToken) {
    const result = await $services.authService.refresh();
    user.value.accessToken = result.data.accessToken;
    return await axios(response.config);
  } else if (response.status === 401) {
    navigateTo("/login");
    return Promise.reject(response);
  }
}

export default defineNuxtPlugin(() => {
  const rc = useRuntimeConfig();
  const { user } = storeToRefs(useAuthStore());

  axios.defaults.baseURL = rc.public.baseURL;
  axios.defaults.headers.common.Authorization = `Bearer ${user.value?.accessToken}`;

  axios.interceptors.response.use(function onFullfilled(config) {
    return config;
  }, onRejected);
});
