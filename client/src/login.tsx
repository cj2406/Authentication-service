import { useState } from "react"
import { authApi } from "./dependency/dependency"
import { setAccessToken } from "./auth/authstore"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    setError("")

    try {
      const result = await authApi.login(
        email,
        password
      )

      setAccessToken(result.accessToken)

      console.log("Logged in:", result.user)
    } catch (error) {
      console.error(error)
      setError("Invalid email or password")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">
        Login
      </button>

      {error && <p>{error}</p>}
    </form>
  )
}

export default Login