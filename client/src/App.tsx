import { useEffect, useState } from "react"
import Login from "./components/login"
import { apiClient } from "./dependency/dependency"

type TestResponse = {
  message: string
}

function App() {
  const [message, setMessage] = useState("Connecting...")

  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    apiClient
      .refreshAccessToken()
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
      <Login />
    </main>
  )
}

export default App