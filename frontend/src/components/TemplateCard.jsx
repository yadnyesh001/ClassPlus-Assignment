import TemplatePreview from './TemplatePreview.jsx';

export default function TemplateCard({ template, name, profilePic, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(template)}
      className="group relative bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-md transition text-left"
    >
      <div className="bg-slate-100">
        <TemplatePreview
          template={template}
          name={name}
          profilePic={profilePic}
          maxWidth={500}
          aspectRatio={4 / 5}
        />
      </div>
      <div className="p-3 flex items-center justify-between">
        <div>
          <div className="font-medium text-slate-800 text-sm">{template.title}</div>
          <div className="text-xs text-slate-500">{template.category}</div>
        </div>
        {template.isPremium && (
          <span className="text-[10px] uppercase tracking-wide font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            Premium
          </span>
        )}
      </div>
    </button>
  );
}
