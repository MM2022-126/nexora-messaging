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
    <aside className="flex h-full w-full flex-col border-r border-[#ecd9cc] bg-[#fffaf5]/90 dark:border-[#3b2f2d] dark:bg-[#201c1a]/90 backdrop-blur-xl">
      <div className="border-b border-[#ecd9cc] bg-[#f7efe6] p-4 dark:border-[#3b2f2d] dark:bg-[#2a221f]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <UserAvatar user={currentUser} size="sm" />
            <div>
              <p className="text-sm font-semibold text-[#2f241f] dark:text-[#f7efe9]">{currentUser.name}</p>
              <p className="text-xs text-[#725f58] dark:text-[#d7c1b5]">{currentUser.username}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onNewConversation}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#d9775f] px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[#c7654e] dark:bg-[#e6987b] dark:text-[#2b201d] dark:hover:bg-[#f0b39d]"
          >
            <MessageSquarePlus className="h-4 w-4" />
            New chat
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ecd9cc] bg-white text-[#725f58] dark:border-[#524643] dark:bg-[#2d2623] dark:text-[#f3e4dc]"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          <UserSearch value={query} onChange={setQuery} placeholder="Search chats..." />
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#5c4e4a] dark:text-[#f3e4dc]">
          <Sparkles className="h-4 w-4 text-[#d9775f]" />
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
                    ? 'border-[#f2c7b8] bg-[#fef0e6] dark:border-[#664a44] dark:bg-[#312422]'
                    : 'border-transparent bg-transparent hover:bg-[#f5ece5] dark:hover:bg-[#2a221f]'
                }`}
              >
                <div className="relative">
                  <UserAvatar user={participant} size="sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-[#2f241f] dark:text-[#f7efe9]">{participant?.name || 'Unknown user'}</p>
                    {unread > 0 && (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d9775f] px-1 text-[10px] font-bold text-white">
                        {unread}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-[#725f58] dark:text-[#d7c1b5]">
                    {conversation.lastMessage || 'No messages yet'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-[#a38c82] dark:text-[#bfa69c]">
                    {conversation.updatedAt ? new Date(conversation.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                  <MessageSquare className="h-3.5 w-3.5 text-[#d0b3a4] dark:text-[#8d756d]" />
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
