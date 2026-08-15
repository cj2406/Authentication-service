import axios, {
  type AxiosInstance,
  type AxiosRequestConfig
} from "axios"

class ApiClient {
  private static instance :ApiClient
  private readonly client: AxiosInstance

  private constructor() {
    this.client = axios.create({
      baseURL: "http://localhost:5000/api",
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }

    return ApiClient.instance
  }

  public get<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.get<T>(url, config)
  }

  public post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) {
    return this.client.post<T>(url, data, config)
  }

  public put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig  //config?:
  ) {
    return this.client.put<T>(url, data, config)
  }

  public delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.delete<T>(url, config)
  }
}

export default ApiClient