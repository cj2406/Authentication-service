import { useState } from "react"
import type { SyntheticEvent } from "react"
import { setAccessToken } from "../auth/authstore"

import "./login.css"


function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    setError("")

    try {
      const result = await authApi.login(
        email,
        password
      )

      setAccessToken(result.accessToken)
      console.log("Access token:", result.accessToken)
      

    } catch (error) {
      console.error(error)
      setError("Invalid email or password")
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

  <button type="submit">
    Login
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