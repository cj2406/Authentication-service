import { useEffect, useState } from "react"
import Login from "./components/login"
import Signup from "./components/signup"
import Authenticated from "./components/authenticated"
import { apiClient } from "./dependency/dependency"
import "./App.css"

type TestResponse = {
  message: string
}

function App() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [message, setMessage] = useState("Connecting...")

  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    apiClient
      .refreshAccessToken()
      .then((token) => setIsAuthenticated(Boolean(token)))
      .finally(() => setCheckingSession(false))
  }, [])

  useEffect(() => {
    if (checkingSession) return

    apiClient
      .get<TestResponse>("/test")
      .then((response) => setMessage(response.data.message))
      .catch(() => setMessage("Failed to connect to API"))
  }, [checkingSession])

  if (checkingSession) {
    return <p>Loading...</p>
  }

  return (
    <main>
      <h1>{message}</h1>
      {isAuthenticated ? (
        <Authenticated onLogout={() => setIsAuthenticated(false)} />
      ) : authMode === "login" ? (
        <Login
          onSwitchToRegister={() => setAuthMode("signup")}
          onLoginSuccess={() => setIsAuthenticated(true)}
          initialEmail={loginEmail}
        />
      ) : (
        <Signup
          onSwitchToLogin={(email) => {
            setLoginEmail(email)
            setAuthMode("login")
          }}
        />
      )}
    </main>
  )
}

export default App