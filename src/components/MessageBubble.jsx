import { CheckCheck, PencilLine, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MessageBubble({ message, onEdit, onDelete, isReplying, onReply }) {
  const { currentUser } = useAuth();
  const isOwn = message.senderId === currentUser?.id;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] rounded-2xl px-3 py-2 ${isOwn ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'}`}>
        {message.replyTo && (
          <div className={`mb-2 rounded-xl px-2 py-1 text-xs ${isOwn ? 'bg-sky-400/30 text-sky-50' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200'}`}>
            Replying to {message.replyTo.content}
          </div>
        )}

        <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>

        <div className={`mt-2 flex items-center justify-between gap-3 text-[10px] ${isOwn ? 'text-sky-100' : 'text-slate-500 dark:text-slate-300'}`}>
          <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isOwn && (
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Edit message" onClick={() => onEdit(message)} className="hover:text-sky-50"><PencilLine className="h-3 w-3" /></button>
              <button type="button" aria-label="Delete message" onClick={() => onDelete(message.id)} className="hover:text-sky-50"><Trash2 className="h-3 w-3" /></button>
              <button type="button" aria-label="Reply to message" onClick={() => onReply(message)} className="hover:text-sky-50"><CheckCheck className="h-3 w-3" /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
