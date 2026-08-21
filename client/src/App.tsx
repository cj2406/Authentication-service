import { useEffect, useState } from "react"
import Login from "./components/login"
import { apiClient } from "./dependency/dependency"
type TestResponse = {
  message: string
}

function App() {
  const [message, setMessage] = useState("Connecting...")

  useEffect(() => {
    console.log("1. useEffect is running")

    console.log("2. ApiClient ready")

    apiClient
      .get<TestResponse>("/test")
      .then((response) => {
        console.log("3. API response:", response.data)
        setMessage(response.data.message)
      })
      .catch((error) => {
        console.error("4. API error:", error)
        setMessage("Failed to connect to API")
      })
  }, [])

  return (
    <main>
      <h1>{message}</h1>
      <Login />
    </main>
  )
}

export default App