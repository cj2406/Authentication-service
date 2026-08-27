import { useEffect, useState } from "react"
import { apiClient } from "../dependency/dependency"
import { authApi } from "../dependency/dependency"
import { clearAccessToken } from "../auth/authstore"

import "./login.css"

type AuthenticatedProps = {
  onLogout: () => void
}

type MeResponse = {
  message: string
  userId?: string
}

function Authenticated({ onLogout }: AuthenticatedProps) {
  const [user, setUser] = useState<MeResponse | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    apiClient
      .get<MeResponse>("/users/me")
      .then((response) => setUser(response.data))
      .catch(() => setError("Your session could not be loaded."))
  }, [])

  async function handleLogout() {
    await authApi.logout().catch(() => undefined)
    clearAccessToken()
    onLogout()
  }

  return (
    <section className="login">
      <h2>Welcome back</h2>
      {user ? <p>{user.message}</p> : <p>{error || "Loading your account..."}</p>}
      {user?.userId && <p>User ID: {user.userId}</p>}
      <button type="button" onClick={handleLogout}>Log out</button>
    </section>
  )
}

export default Authenticated