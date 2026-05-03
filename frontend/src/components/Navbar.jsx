import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, isGuest, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-slate-800 text-lg">
          Greetings
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-indigo-600 font-medium' : 'text-slate-600 hover:text-slate-900'
            }
          >
            Home
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? 'text-indigo-600 font-medium' : 'text-slate-600 hover:text-slate-900'
                }
              >
                {isGuest ? 'Guest' : user.name}
              </NavLink>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-slate-600 hover:text-slate-900"
              >
                {isGuest ? 'Exit guest' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-slate-900">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
