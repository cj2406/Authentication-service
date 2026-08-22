import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig
} from "axios"

import { getAccessToken, setAccessToken, clearAccessToken } from "../auth/authstore"


type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

class ApiClient {
  private readonly client: AxiosInstance

  // Holds the in-flight refresh call, if any, so concurrent 401s
  // share one request instead of each firing their own refresh.
  private refreshPromise: Promise<string | null> | null = null

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

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest=error.config as RetriableConfig | undefined

        const isAuthEndpoint =
          originalRequest?.url?.includes("/auth/login") ||
          originalRequest?.url?.includes("/auth/register") ||
          originalRequest?.url?.includes("/auth/refresh")

        // Only handle 401s, only retry once per request, never intercept
        // the auth endpoints themselves (that would loop forever).
        if (
          error.response?.status !== 401 ||
          !originalRequest ||
          originalRequest._retry ||
          isAuthEndpoint
        ) {
          return Promise.reject(error)
        }

        originalRequest._retry = true

        const newToken = await this.refreshAccessToken()

        if (!newToken) {
          clearAccessToken()
          return Promise.reject(error)
        }

        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return this.client.request(originalRequest)
      }
    )
  }

  // Calls /auth/refresh at most once at a time, no matter how many
  // requests trigger it concurrently. Returns the new access token,
  // or null if the refresh cookie is missing/expired.
  public async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshPromise) {
      this.refreshPromise = this.client
        .post<{ accessToken: string }>("/auth/refresh")
        .then((response) => {
          const token = response.data.accessToken
          setAccessToken(token)
          return token
        })
        .catch(() => null)
        .finally(() => {
          this.refreshPromise = null
        })
    }

    return this.refreshPromise
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