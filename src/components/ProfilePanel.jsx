import { PencilLine, Sparkles, UserRound } from 'lucide-react';
import UserAvatar from './UserAvatar';

export default function ProfilePanel({ user, onEditProfile }) {
  if (!user) return null;

  return (
    <aside className="flex h-full flex-col border-l border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/75 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <UserRound className="h-4 w-4 text-sky-500" />
          Profile
        </div>
        <button type="button" onClick={onEditProfile} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">
          <PencilLine className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center text-center">
        <UserAvatar user={user} size="xl" />
        <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">{user.name}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">@{user.username}</p>
      </div>

      <div className="mt-6 space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</p>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <span className={`h-2.5 w-2.5 rounded-full ${user.isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            {user.isOnline ? 'Online' : 'Offline'}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Last seen</p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{new Date(user.lastSeen).toLocaleString()}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Bio</p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{user.bio || 'Available to chat'}</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-500 p-4 text-white shadow-soft">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          Workspace summary
        </div>
        <p className="mt-3 text-2xl font-semibold">{Math.max(1, Math.floor(Math.random() * 18 + 8))} active chats</p>
      </div>
    </aside>
  );
}
