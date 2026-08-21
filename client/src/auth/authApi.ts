import type HttpClient from "./HttpClient"

type LoginResponse = {
  message: string
  accessToken: string
  user: {
    id: string
    email: string
  }
}

class AuthApi {
  private readonly api: HttpClient

  constructor(api: HttpClient) {
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