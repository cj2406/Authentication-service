import axios, {
  type AxiosInstance,
  type AxiosRequestConfig
} from "axios"

import { getAccessToken } from "../auth/authstore"

class ApiClient {
  private readonly client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: "http://localhost:5000/api",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    })

    this.client.interceptors.request.use((config) => {
      const token = getAccessToken()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    })
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
    config?: AxiosRequestConfig
  ) {
    return this.client.put<T>(url, data, config)
  }

  public delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ) {
    return this.client.delete<T>(url, config)
  }
}

export default ApiClient