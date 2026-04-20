import { AuthProvider } from "./context/AuthContext"
import AppRouter from "./router/AppRouter"
import { ConfirmProvider } from "./context/ConfirmContext"

function App() {
  return (
    <AuthProvider>
      <ConfirmProvider>
        <AppRouter />
      </ConfirmProvider>
    </AuthProvider>
  )
}

export default App