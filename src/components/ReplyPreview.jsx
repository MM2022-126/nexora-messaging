import { CornerDownRight, X } from 'lucide-react';

export default function ReplyPreview({ reply, onCancel }) {
  if (!reply) return null;

  return (
    <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-200">
      <div className="flex items-center gap-2 truncate">
        <CornerDownRight className="h-4 w-4 shrink-0" />
        <span className="truncate">{reply.content}</span>
      </div>
      <button type="button" aria-label="Cancel reply" onClick={onCancel} className="rounded-full p-1 hover:bg-sky-100 dark:hover:bg-sky-900/80">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
