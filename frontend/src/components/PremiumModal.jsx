export default function PremiumModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-3xl mb-2">⭐</div>
        <h2 className="text-lg font-semibold text-slate-800">Upgrade to access this template</h2>
        <p className="text-sm text-slate-500 mt-2">
          This is a premium template. Upgrade your account to unlock the full library.
        </p>
        <button
          onClick={onClose}
          className="mt-5 w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
