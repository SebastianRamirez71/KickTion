import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home"
import { Callback } from "./pages/CallBack"
import { useAuth } from "./contexts/AuthContext"
import Posts from "./pages/Posts"
import CreatePostList from "./pages/CreatePostList"
import PostListDetail from "./pages/PostListDetail"

function App() {
  const { user } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/create" element={<CreatePostList />} />
          <Route path="/posts/edit/:id" element={<CreatePostList />} />
          <Route path="/posts/:id" element={<PostListDetail />} />
          <Route path="/callback" element={<Callback />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
