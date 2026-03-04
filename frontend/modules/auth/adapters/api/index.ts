import axios, { type AxiosResponse } from "axios";
import type { TUser } from "../../entities";

export class AuthApi {
  profile() {
    return axios.get<TUser>("auth/profile");
  }
  login(email: string, password: string) {
    return axios.post<TUser>("/auth/login", { email, password });
  }

  register(
    password: string,
    passwordConfirm: string,
    username: string,
    email: string
  ) {
    return axios.post("/auth/register", {
      email,
      password,
      passwordConfirm,
      username,
    });
  }

  refresh() {
    return axios.post<{ accessToken: string }>("/auth/refresh");
  }
}
