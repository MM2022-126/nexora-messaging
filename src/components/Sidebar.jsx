import { MessageSquare, MessageSquarePlus, Search, Settings, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import UserAvatar from './UserAvatar';
import UserSearch from './UserSearch';
import ThemeToggle from './ThemeToggle';
import EmptyState from './EmptyState';

export default function Sidebar({ onSelectConversation, onNewConversation, activeConversationId }) {
  const { currentUser } = useAuth();
  const { conversations, getUnreadCount, getUserById } = useChat();
  const [query, setQuery] = useState('');

  const visibleChats = useMemo(() => {
    const term = query.trim().toLowerCase();
    return conversations.filter((conversation) => {
      const colleagues = conversation.participants.filter((id) => id !== currentUser?.id);
      const peer = colleagues.map((id) => getUserById(id)).filter(Boolean)[0];
      const lastMessage = conversation.lastMessage || '';
      const name = peer?.name || '';
      return !term || name.toLowerCase().includes(term) || lastMessage.toLowerCase().includes(term);
    });
  }, [conversations, query, currentUser, getUserById]);

  if (!currentUser) return null;

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/75 backdrop-blur-xl">
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <UserAvatar user={currentUser} size="sm" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{currentUser.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.username}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onNewConversation}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
          >
            <MessageSquarePlus className="h-4 w-4" />
            New chat
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          <UserSearch value={query} onChange={setQuery} placeholder="Search chats..." />
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <Sparkles className="h-4 w-4 text-sky-500" />
          Recent chats
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-3">
        {visibleChats.length === 0 ? (
          <EmptyState title="No conversations yet" description="Start a new conversation to keep the chat history going." />
        ) : (
          visibleChats.map((conversation) => {
            const peer = (conversation.participants || []).find((person) => person !== currentUser.id);
            const participant = getUserById(peer) || currentUser;
            const unread = getUnreadCount(conversation);
            const active = conversation.id === activeConversationId;

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  active
                    ? 'border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/40'
                    : 'border-transparent bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900/80'
                }`}
              >
                <div className="relative">
                  <UserAvatar user={participant} size="sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{participant?.name || 'Unknown user'}</p>
                    {unread > 0 && (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-bold text-white">
                        {unread}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {conversation.lastMessage || 'No messages yet'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {conversation.updatedAt ? new Date(conversation.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                  <MessageSquare className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
