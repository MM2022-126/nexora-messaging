import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MessageSquareText, PanelLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageComposer from '../components/MessageComposer';
import ProfilePanel from '../components/ProfilePanel';
import NewConversationModal from '../components/NewConversationModal';
import ProfileModal from '../components/ProfileModal';
import EmptyState from '../components/EmptyState';
import { getStorage } from '../utils/storage';
import { useNotifications } from '../context/NotificationContext';

export default function DashboardLayout() {
  const { currentUser, logout, updateProfile } = useAuth();
  const { conversations, createConversation, getMessagesForConversation, sendMessage, editMessage, deleteMessage, getUserById, markConversationAsRead } = useChat();
  const { success, error } = useNotifications();
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [newConversationOpen, setNewConversationOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [mobileView, setMobileView] = useState('chat');

  useEffect(() => {
    if (!conversations.length) {
      setSelectedConversationId(null);
      return;
    }

    const saved = getStorage('messaging_active_chat', conversations[0].id);
    if (saved && conversations.some((item) => item.id === saved)) {
      setSelectedConversationId(saved);
    } else if (!selectedConversationId || !conversations.some((item) => item.id === selectedConversationId)) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  useEffect(() => {
    if (selectedConversationId) {
      localStorage.setItem('messaging_active_chat', JSON.stringify(selectedConversationId));
    }
  }, [selectedConversationId]);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === selectedConversationId) || null,
    [conversations, selectedConversationId],
  );

  const peerUser = useMemo(() => {
    if (!activeConversation) return null;
    const otherId = activeConversation.participants.find((person) => person !== currentUser?.id);
    return getUserById(otherId) || null;
  }, [activeConversation, currentUser, getUserById]);

  const activeMessages = useMemo(
    () => (selectedConversationId ? getMessagesForConversation(selectedConversationId) : []),
    [selectedConversationId, getMessagesForConversation],
  );

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    setMobileView('chat');
    markConversationAsRead(conversationId);
  };

  const handleNewConversation = (userId) => {
    const created = createConversation(userId);
    if (created) {
      setSelectedConversationId(created.id);
      setNewConversationOpen(false);
      setMobileView('chat');
      success('Conversation created.');
    }
  };

  const handleSendMessage = (content, reply) => {
    if (!selectedConversationId) return;
    const sentMessage = sendMessage({ conversationId: selectedConversationId, content, replyTo: reply ? reply.id : null });
    if (sentMessage) {
      setReplyTo(null);
      success('Message sent.');
    } else {
      error('Message could not be sent.');
    }
  };

  const handleEditMessage = (message) => {
    const nextContent = window.prompt('Edit message', message.content);
    if (nextContent && nextContent.trim()) {
      editMessage(message.id, nextContent.trim());
      success('Message updated.');
    }
  };

  const handleDeleteMessage = (messageId) => {
    deleteMessage(messageId);
    success('Message deleted.');
  };

  const handleProfileSave = (changes) => {
    const updated = updateProfile({ ...changes, username: changes.username.trim(), name: changes.name.trim() });
    if (updated) {
      success('Profile updated.');
      setProfileModalOpen(false);
    } else {
      error('Unable to update profile.');
    }
  };

  const handleLogout = () => {
    logout();
    success('Logged out successfully.');
  };

  return (
    <div className="flex min-h-screen bg-[#f6efe8] text-[#2f241f] dark:bg-[#1d1715] dark:text-[#f7efe9]">
      <div className="mx-auto flex h-screen w-full max-w-[1600px] gap-4 p-3 sm:p-4 lg:p-5">
        <aside className={`${mobileView === 'chat' ? 'hidden' : 'block'} w-full lg:block lg:w-[360px]`}>
          <Sidebar
            activeConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            onNewConversation={() => setNewConversationOpen(true)}
          />
        </aside>

        <main className={`${mobileView === 'sidebar' ? 'hidden' : 'flex'} flex-1 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900`}>
          {activeConversation && peerUser ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-200 p-3 dark:border-slate-800 lg:hidden">
                <button type="button" onClick={() => setMobileView('sidebar')} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <span className="text-sm font-medium">{peerUser.name}</span>
                <button type="button" onClick={() => setProfileModalOpen(true)} className="rounded-full border border-slate-200 p-2 dark:border-slate-700">
                  <PanelLeft className="h-4 w-4" />
                </button>
              </div>
              <ChatHeader user={peerUser} onOpenProfile={() => setProfileModalOpen(true)} />
              <MessageList messages={activeMessages} onEdit={handleEditMessage} onDelete={handleDeleteMessage} onReply={setReplyTo} />
              <MessageComposer
                conversationId={selectedConversationId}
                replyTo={replyTo}
                onClearReply={() => setReplyTo(null)}
                onSend={handleSendMessage}
              />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6">
              <EmptyState
                title="Choose a chat"
                description="Select a conversation or create a new one to get started."
                action={
                  <button type="button" onClick={() => setNewConversationOpen(true)} className="mt-4 rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white">
                    Start a chat
                  </button>
                }
              />
            </div>
          )}
        </main>

        <aside className={`${mobileView === 'sidebar' || mobileView === 'chat' ? 'hidden' : 'block'} hidden w-[320px] lg:block`}>
          {currentUser && <ProfilePanel user={currentUser} onEditProfile={() => setProfileModalOpen(true)} />}
        </aside>

        <div className="fixed bottom-4 left-4 right-4 z-30 flex items-center justify-between rounded-full border border-slate-200 bg-white/80 p-2 shadow-soft backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80 lg:hidden">
          <button type="button" onClick={() => setMobileView('sidebar')} className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 ${mobileView === 'sidebar' ? 'bg-sky-500 text-white' : 'text-slate-600 dark:text-slate-200'}`}>
            <MessageSquareText className="h-4 w-4" />
            Chats
          </button>
          <button type="button" onClick={() => setMobileView('chat')} className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 ${mobileView === 'chat' ? 'bg-sky-500 text-white' : 'text-slate-600 dark:text-slate-200'}`}>
            <PanelLeft className="h-4 w-4" />
            Chat
          </button>
          <button type="button" onClick={() => setProfileModalOpen(true)} className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 ${mobileView === 'profile' ? 'bg-sky-500 text-white' : 'text-slate-600 dark:text-slate-200'}`}>
            <PanelLeft className="h-4 w-4" />
            Profile
          </button>
          <button type="button" onClick={handleLogout} className="ml-2 rounded-full bg-slate-900 px-3 py-2 text-xs font-medium text-white dark:bg-slate-100 dark:text-slate-900">
            Logout
          </button>
        </div>
      </div>

      {newConversationOpen && (
        <NewConversationModal currentUser={currentUser} onClose={() => setNewConversationOpen(false)} onSelectUser={handleNewConversation} />
      )}

      {profileModalOpen && (
        <ProfileModal user={currentUser} onClose={() => setProfileModalOpen(false)} onSave={handleProfileSave} />
      )}
    </div>
  );
}
