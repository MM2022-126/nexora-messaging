import { MoreHorizontal, Phone, Video } from 'lucide-react';
import UserAvatar from './UserAvatar';

export default function ChatHeader({ user, onOpenProfile }) {
  if (!user) return null;

  return (
    <header className="flex items-center justify-between border-b border-[#ecd9cc] bg-[#fffaf5]/80 px-4 py-3 dark:border-[#3d312d] dark:bg-[#201c1a]/80 backdrop-blur-xl">
      <button type="button" className="flex flex-1 items-center gap-3 text-left" onClick={onOpenProfile}>
        <UserAvatar user={user} size="sm" />
        <div>
          <p className="text-sm font-semibold text-[#2f241f] dark:text-[#f7efe9]">{user.name}</p>
          <p className="text-xs text-[#725f58] dark:text-[#d7c1b5]">{user.isOnline ? 'Online now' : `Last active ${new Date(user.lastSeen).toLocaleString()}`}</p>
        </div>
      </button>

      <div className="flex items-center gap-2">
        <button type="button" aria-label="Voice call" className="rounded-full border border-[#ecd9cc] bg-[#f9f2ec] p-2 text-[#5a4844] hover:bg-[#f1e4da] dark:border-[#524643] dark:bg-[#2d2623] dark:text-[#f3e4dc] dark:hover:bg-[#332d2b]">
          <Phone className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Video call" className="rounded-full border border-[#ecd9cc] bg-[#f9f2ec] p-2 text-[#5a4844] hover:bg-[#f1e4da] dark:border-[#524643] dark:bg-[#2d2623] dark:text-[#f3e4dc] dark:hover:bg-[#332d2b]">
          <Video className="h-4 w-4" />
        </button>
        <button type="button" aria-label="More actions" className="rounded-full border border-[#ecd9cc] bg-[#f9f2ec] p-2 text-[#5a4844] hover:bg-[#f1e4da] dark:border-[#524643] dark:bg-[#2d2623] dark:text-[#f3e4dc] dark:hover:bg-[#332d2b]">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
