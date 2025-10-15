import type { AuthApi } from "../adapters/api";

export class AuthService {
  constructor(private api: AuthApi, private store: any) {}

  async login(email: string, password: string) {
    const result = await this.api.login(email, password);
    console.log(this.store);

    this.store.user = result.data;
    return result;
  }
}
