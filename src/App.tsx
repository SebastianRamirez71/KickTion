import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home"
import { Callback } from "./pages/CallBack"
import { useAuth } from "./contexts/AuthContext"

function App() {
  const { user } = useAuth();
  console.log(user)
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/callback" element={<Callback />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
