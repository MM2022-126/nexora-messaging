import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { getStorage } from '../utils/storage';

export default function NewConversationModal({ currentUser, onClose, onSelectUser }) {
  const [query, setQuery] = useState('');
  const users = getStorage('messaging_users', []).filter((user) => user.id !== currentUser?.id);

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => user.name.toLowerCase().includes(term) || user.username.toLowerCase().includes(term));
  }, [query, users]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">New conversation</h3>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close new conversation dialog">
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          <Search className="h-4 w-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full border-none bg-transparent text-sm outline-none"
            placeholder="Search users"
            aria-label="Search for a user"
          />
        </label>

        <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No users found.
            </p>
          ) : (
            filteredUsers.map((user) => (
              <button
                type="button"
                key={user.id}
                onClick={() => onSelectUser(user.id)}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <img src={user.avatar} alt={user.name} className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">@{user.username}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
