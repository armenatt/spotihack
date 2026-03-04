import type { AuthApi } from "../adapters/api";

export class AuthService {
  constructor(private api: AuthApi, private store: any) {}

  async login(email: string, password: string) {
    const result = await this.api.login(email, password);
    this.store.user = result.data;
    return result;
  }

  async profile() {
    const result = await this.api.profile();
    return result.data;
  }

  async register(
    password: string,
    passwordConfirm: string,
    username: string,
    email: string
  ) {
    return this.api.register(password, passwordConfirm, username, email);
  }

  refresh() {
    return this.api.refresh();
  }
}
