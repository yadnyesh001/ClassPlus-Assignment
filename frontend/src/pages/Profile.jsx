import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Profile() {
  const { user, isGuest, updateProfile } = useAuth();
  const [name, setName] = useState(user.name);
  const [profilePic, setProfilePic] = useState(user.profilePic || '');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function onPicChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePic(await fileToDataUrl(file));
  }

  async function onSave(e) {
    e.preventDefault();
    setBusy(true);
    setStatus('');
    try {
      await updateProfile({ name, profilePic });
      setStatus('Saved');
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-800">Profile</h1>
      {isGuest && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mt-3">
          You're in guest mode. Changes are saved on this device only.
        </p>
      )}

      <form onSubmit={onSave} className="mt-6 space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={profilePic || 'https://www.gravatar.com/avatar/?d=mp&s=160'}
            alt="avatar"
            className="h-20 w-20 rounded-full object-cover border border-slate-200"
          />
          <label className="text-sm">
            <span className="text-slate-600">Change picture</span>
            <input
              type="file"
              accept="image/*"
              onChange={onPicChange}
              className="mt-1 block text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm text-slate-600">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        {!isGuest && (
          <div className="text-sm text-slate-500">
            Email: <span className="text-slate-700">{user.email}</span>
          </div>
        )}

        {status && <div className="text-sm text-slate-600">{status}</div>}

        <button
          type="submit"
          disabled={busy}
          className="bg-indigo-600 text-white rounded-md py-2 px-4 hover:bg-indigo-700 disabled:opacity-60"
        >
          {busy ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  );
}
