import type { AuthApi } from "../adapters/api";

export class AuthService {
  constructor(private api: AuthApi, private store: any) {}

  async login(email: string, password: string) {
    const result = await this.api.login(email, password);
    this.store.user = result.data;
    return result;
  }

  async register(
    fullName: string,
    password: string,
    passwordConfirm: string,
    username: string,
    email: string
  ) {
    return this.api.register(
      fullName,
      password,
      passwordConfirm,
      username,
      email
    );
  }

  refresh() {
    return this.api.refresh();
  }
}
