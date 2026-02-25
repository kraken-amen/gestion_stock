import { useState } from "react"
import { login } from "../services/authService"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    const data = await login(username, password)
    loginUser(data)
    navigate("/dashboard")
  }

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login