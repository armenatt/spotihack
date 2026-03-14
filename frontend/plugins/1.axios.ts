import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "~/modules/auth/adapters/store";

async function onRejected(response: AxiosError) {
  const authStore = useAuthStore();

  const { accessToken } = storeToRefs(authStore);
  const { $services } = useNuxtApp();
  if (response.status === 401 && accessToken.value?.length) {
    const result = await $services.authService.refresh();
    localStorage.setItem("accessToken", result.data.accessToken);
    accessToken.value = result.data.accessToken;
    response.config?.headers.setAuthorization(`Bearer ${accessToken.value}`);

    return await axios(response.response?.config as AxiosRequestConfig);
  }
}

function onAuth(config: InternalAxiosRequestConfig) {
  const { accessToken } = storeToRefs(useAuthStore());

  if (accessToken.value) {
    config.headers.Authorization = `Bearer ${accessToken.value}`;
  }

  return config;
}

export default defineNuxtPlugin(() => {
  const rc = useRuntimeConfig();

  axios.defaults.baseURL = rc.public.baseURL;
  axios.defaults.withCredentials = true;
  axios.interceptors.request.use(onAuth, onRejected);
});
