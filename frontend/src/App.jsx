import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Editor from './pages/Editor.jsx';
import { useAuth } from './context/AuthContext.jsx';

function Gate({ children }) {
  const { user, isGuest, loading } = useAuth();
  if (loading) return <div className="p-8 text-slate-500">Loading…</div>;
  if (!user || isGuest) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <Gate>
                <Profile />
              </Gate>
            }
          />
          <Route
            path="/editor/:id"
            element={
              <Gate>
                <Editor />
              </Gate>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
