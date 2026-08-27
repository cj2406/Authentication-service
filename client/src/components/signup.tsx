import { useState } from "react"
import type { SyntheticEvent } from "react"
import { authApi } from "../dependency/dependency"

import "./login.css"

type SignupProps = {
  onSwitchToLogin: (email: string) => void
}

function Signup({ onSwitchToLogin }: SignupProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [created, setCreated] = useState(false)

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      await authApi.register(email, password)
      setCreated(true)
    } catch (error) {
      console.error(error)
      setError("Unable to create your account")
    }
  }

  if (created) {
    return (
      <section className="login">
        <h2>Account created</h2>
        <p className="login-success">Your account is ready. Sign in to continue.</p>
        <button type="button" onClick={() => onSwitchToLogin(email)}>
          Go to login
        </button>
      </section>
    )
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h2>Create an account</h2>

      <div className="login-field">
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="login-field">
        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />
      </div>

      <div className="login-field">
        <label htmlFor="signup-confirm-password">Confirm password</label>
        <input
          id="signup-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          minLength={8}
          required
        />
      </div>

      <button type="submit">Sign up</button>
      <button className="login-secondary-button" type="button" onClick={() => onSwitchToLogin(email)}>
        Already have an account?
      </button>

      {error && <p className="login-error">{error}</p>}
    </form>
  )
}

export default Signup