import { MoreHorizontal, Phone, Video } from 'lucide-react';
import UserAvatar from './UserAvatar';

export default function ChatHeader({ user, onOpenProfile }) {
  if (!user) return null;

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/80 backdrop-blur-xl">
      <button type="button" className="flex flex-1 items-center gap-3 text-left" onClick={onOpenProfile}>
        <UserAvatar user={user} size="sm" />
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{user.isOnline ? 'Online now' : `Last active ${new Date(user.lastSeen).toLocaleString()}`}</p>
        </div>
      </button>

      <div className="flex items-center gap-2">
        <button type="button" aria-label="Voice call" className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900">
          <Phone className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Video call" className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900">
          <Video className="h-4 w-4" />
        </button>
        <button type="button" aria-label="More actions" className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
