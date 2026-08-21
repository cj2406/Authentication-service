import ApiClient from "../api/ApiClient"
import AuthApi from "../auth/authApi"

export const apiClient = new ApiClient()

export const authApi = new AuthApi(apiClient)