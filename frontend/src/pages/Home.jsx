import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import TemplateCard from '../components/TemplateCard.jsx';
import PremiumModal from '../components/PremiumModal.jsx';

export default function Home() {
  const { user, isGuest } = useAuth();
  const isLoggedIn = !!user && !isGuest;
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    api
      .templates()
      .then((data) => setTemplates(data))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const categories = useMemo(() => {
    const set = new Set(templates.map((t) => t.category));
    return ['All', ...Array.from(set)];
  }, [templates]);

  const visible = useMemo(
    () =>
      activeCategory === 'All'
        ? templates
        : templates.filter((t) => t.category === activeCategory),
    [templates, activeCategory]
  );

  const previewName = user?.name || 'Your Name';
  const previewPic = user?.profilePic || '';

  function handleSelect(tpl) {
    if (tpl.isPremium) {
      setPremiumOpen(true);
      return;
    }
    navigate(`/editor/${tpl._id}`);
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-slate-800">Sign in to browse greetings</h1>
        <p className="text-slate-500 text-sm mt-2">
          Log in or create an account to pick a template and personalize it with your name and photo.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/login"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="border border-slate-300 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-50"
          >
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-800">Pick a greeting</h1>
      <p className="text-slate-500 text-sm">
        Tap a template to personalize and download.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              activeCategory === c
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 text-slate-500">Loading templates…</div>
      ) : visible.length === 0 ? (
        <div className="mt-8 text-slate-500">No templates yet. Run the backend seed script.</div>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {visible.map((tpl) => (
            <TemplateCard
              key={tpl._id}
              template={tpl}
              name={previewName}
              profilePic={previewPic}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
    </div>
  );
}
