import ApiClient from "../api/ApiClient"

type LoginResponse = {
  message: string
  accessToken: string
  user: {
    id: string
    email: string
  }
}

class AuthApi {
  private readonly api: ApiClient

  constructor(api: ApiClient) {
    this.api = api
  }

  async login(email: string, password: string) {
    const response = await this.api.post<LoginResponse>(
      "/auth/login",
      {
        email,
        password
      }
    )

    return response.data
  }
}

export default AuthApi