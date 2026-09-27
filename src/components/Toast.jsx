import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

const tones = {
  success: { icon: CheckCircle2, className: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200' },
  error: { icon: TriangleAlert, className: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/70 dark:text-rose-200' },
  info: { icon: Info, className: 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100' },
};

export default function Toast({ toast, onClose }) {
  const config = tones[toast.type] || tones.info;
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-soft ${config.className}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onClose(toast.id)}
        className="rounded-full p-1 transition hover:bg-black/5 dark:hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
