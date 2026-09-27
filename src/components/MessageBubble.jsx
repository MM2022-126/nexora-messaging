import { CheckCheck, PencilLine, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MessageBubble({ message, onEdit, onDelete, isReplying, onReply }) {
  const { currentUser } = useAuth();
  const isOwn = message.senderId === currentUser?.id;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] rounded-2xl px-3 py-2 ${isOwn ? 'bg-[#d9775f] text-white shadow-sm' : 'bg-[#f5eee8] text-[#2f241f] dark:bg-[#352d2b] dark:text-[#f7efe9]'}`}>
        {message.replyTo && (
          <div className={`mb-2 rounded-xl px-2 py-1 text-xs ${isOwn ? 'bg-[#e7a38e]/30 text-[#fff7f2]' : 'bg-[#eadbcf] text-[#5a4844] dark:bg-[#473c39] dark:text-[#f4e8e4]'}`}>
            Replying to {message.replyTo.content}
          </div>
        )}

        <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>

        <div className={`mt-2 flex items-center justify-between gap-3 text-[10px] ${isOwn ? 'text-[#fdeae3]' : 'text-[#7a665f] dark:text-[#d7c1b5]'}`}>
          <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isOwn && (
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Edit message" onClick={() => onEdit(message)} className="hover:text-white"><PencilLine className="h-3 w-3" /></button>
              <button type="button" aria-label="Delete message" onClick={() => onDelete(message.id)} className="hover:text-white"><Trash2 className="h-3 w-3" /></button>
              <button type="button" aria-label="Reply to message" onClick={() => onReply(message)} className="hover:text-white"><CheckCheck className="h-3 w-3" /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
