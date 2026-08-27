import { useState } from "react"
import type { SyntheticEvent } from "react"
import { authApi } from "../dependency/dependency"
import { setAccessToken } from "../auth/authstore"

import "./login.css"


type LoginProps = {
  onSwitchToRegister: () => void
  onLoginSuccess: () => void
  initialEmail?: string
}

function Login({ onSwitchToRegister, onLoginSuccess, initialEmail = "" }: LoginProps) {
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    if (isSubmitting) return

    setError("")
    setIsSubmitting(true)

    try {
      const result = await authApi.login(
        email,
        password
      )

      setAccessToken(result.accessToken)
      onLoginSuccess()

    } catch (error) {
      console.error(error)
      if (error && typeof error === "object" && "response" in error) {
        const response = error.response
        if (response && typeof response === "object" && "status" in response && response.status === 429) {
          setError("Too many attempts. Please try again later.")
          return
        }
      }
      setError("Invalid email or password")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
  <h2>Login</h2>

  <div className="login-field">
    <label htmlFor="email">
      Email
    </label>

    <input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
  </div>

  <div className="login-field">
    <label htmlFor="password">
      Password
    </label>

    <input
      id="password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>

  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? "Logging in..." : "Login"}
  </button>

  <button className="login-secondary-button" type="button" onClick={onSwitchToRegister}>
    Create an account
  </button>

  {error && (
    <p className="login-error">
      {error}
    </p>
  )}
</form>
  )
}

export default Login