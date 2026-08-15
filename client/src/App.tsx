import { useEffect, useState } from "react"
import ApiClient from "./api/ApiClient"

type TestResponse = {
  message: string
}

function App() {
  const [message, setMessage] = useState("Connecting...")

 useEffect(() => {
  console.log("1. useEffect is running")

  const api = ApiClient.getInstance()

  console.log("2. ApiClient created")

  api
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
    </main>
  )
}

export default App