import { Smile, Paperclip, Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getStorage, setStorage } from '../utils/storage';
import ReplyPreview from './ReplyPreview';

const emojiList = ['😊', '😂', '🔥', '🎉', '👍', '❤️', '✨', '😎'];

export default function MessageComposer({ conversationId, replyTo, onClearReply, onSend, disabled = false }) {
  const [value, setValue] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const draftKey = conversationId ? `messaging_drafts_${conversationId}` : 'messaging_drafts_default';

  useEffect(() => {
    if (!conversationId) return;
    const draft = getStorage(draftKey, '');
    setValue(draft);
  }, [conversationId, draftKey]);

  useEffect(() => {
    if (!conversationId) return;
    setStorage(draftKey, value);
  }, [value, conversationId, draftKey]);

  const remaining = useMemo(() => 500 - value.length, [value]);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value, replyTo);
    setValue('');
    if (onClearReply) onClearReply();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-950/90">
      {replyTo && <ReplyPreview reply={replyTo} onCancel={onClearReply} />}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value.slice(0, 500))}
          onKeyDown={handleKeyDown}
          rows={3}
          className="w-full resize-none border-none bg-transparent px-2 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          placeholder="Write a message..."
          aria-label="Message composer"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Add attachment" className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              <Paperclip className="h-4 w-4" />
            </button>
            <div className="relative">
              <button
                type="button"
                aria-label="Choose emoji"
                onClick={() => setShowEmoji((current) => !current)}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Smile className="h-4 w-4" />
              </button>
              {showEmoji && (
                <div className="absolute bottom-12 left-0 z-10 flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-700 dark:bg-slate-800">
                  {emojiList.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      aria-label={`Insert ${emoji}`}
                      onClick={() => {
                        setValue((current) => `${current}${emoji}`);
                        setShowEmoji(false);
                      }}
                      className="text-xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs ${remaining < 50 ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'}`}>{remaining}</span>
            <button
              type="button"
              onClick={handleSend}
              disabled={!value.trim() || disabled}
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-3 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
