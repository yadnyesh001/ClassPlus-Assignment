import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { renderGreeting, canvasToBlob } from '../utils/canvas.js';
import PremiumModal from '../components/PremiumModal.jsx';

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, continueAsGuest } = useAuth();
  const canvasRef = useRef(null);

  const [template, setTemplate] = useState(null);
  const [name, setName] = useState(user?.name || '');
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [error, setError] = useState('');
  const [shareStatus, setShareStatus] = useState('');

  useEffect(() => {
    api
      .template(id)
      .then((tpl) => {
        if (tpl.isPremium) {
          setPremiumOpen(true);
          return;
        }
        setTemplate(tpl);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  useEffect(() => {
    if (!template || !canvasRef.current) return;
    renderGreeting({
      canvas: canvasRef.current,
      templateUrl: template.imageUrl,
      name: name || 'Your Name',
      profilePic,
      overlayConfig: template.overlayConfig,
      maxWidth: 1024,
    }).catch((err) => setError(err.message));
  }, [template, name, profilePic]);

  async function onPicChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setProfilePic(dataUrl);
    if (!user) continueAsGuest({ name: name || 'Guest', profilePic: dataUrl });
  }

  function onDownload() {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(template?.title || 'greeting').replace(/\s+/g, '_').toLowerCase()}.png`;
    a.click();
  }

  async function onShare() {
    if (!canvasRef.current) return;
    setShareStatus('');
    try {
      const blob = await canvasToBlob(canvasRef.current);
      if (!blob) throw new Error('Could not generate image');
      const file = new File([blob], 'greeting.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: template?.title || 'Greeting' });
        setShareStatus('Shared');
      } else {
        onDownload();
        setShareStatus('Downloaded — paste into WhatsApp / Instagram / Email');
      }
    } catch (err) {
      if (err.name !== 'AbortError') setShareStatus(err.message);
    }
  }

  async function onCopy() {
    if (!canvasRef.current) return;
    setShareStatus('');
    try {
      const blob = await canvasToBlob(canvasRef.current);
      if (!blob) throw new Error('Could not generate image');
      if (!navigator.clipboard || !window.ClipboardItem) {
        throw new Error('Clipboard not supported in this browser');
      }
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setShareStatus('Image copied — paste into WhatsApp / Instagram / Email');
    } catch (err) {
      setShareStatus(err.message);
    }
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-indigo-600 hover:underline"
        >
          ← Back to home
        </button>
      </div>
    );
  }

  if (premiumOpen) {
    return (
      <PremiumModal
        open
        onClose={() => {
          setPremiumOpen(false);
          navigate('/');
        }}
      />
    );
  }

  if (!template) return <div className="p-8 text-slate-500">Loading…</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-[1fr,320px] gap-8">
      <div>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-slate-500 hover:text-slate-800 mb-3"
        >
          ← Back
        </button>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <canvas ref={canvasRef} className="block w-full h-auto" />
        </div>
      </div>

      <aside className="bg-white border border-slate-200 rounded-xl p-5 h-fit space-y-4">
        <div>
          <h2 className="font-semibold text-slate-800">{template.title}</h2>
          <p className="text-xs text-slate-500">{template.category}</p>
        </div>

        <label className="block">
          <span className="text-sm text-slate-600">Name on card</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-600">Profile picture</span>
          <input
            type="file"
            accept="image/*"
            onChange={onPicChange}
            className="mt-1 block w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
          />
        </label>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={onShare}
            className="bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700"
          >
            Share
          </button>
          <button
            onClick={onDownload}
            className="border border-slate-300 text-slate-700 rounded-md py-2 hover:bg-slate-50"
          >
            Download
          </button>
          <button
            onClick={onCopy}
            className="col-span-2 border border-slate-300 text-slate-700 rounded-md py-2 hover:bg-slate-50"
          >
            Copy image
          </button>
        </div>
        {shareStatus && <p className="text-xs text-slate-500">{shareStatus}</p>}
      </aside>
    </div>
  );
}
