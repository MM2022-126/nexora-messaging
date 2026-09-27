import { Fragment, useEffect, useRef } from 'react';
import EmptyState from './EmptyState';
import MessageBubble from './MessageBubble';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function MessageList({ messages, onEdit, onDelete, onReply }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState title="No messages yet" description="Say hello and start the conversation." />
      </div>
    );
  }

  let prevDate = null;

  return (
    <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages.map((message) => {
        const currentDate = formatDate(message.createdAt);
        const showDateSeparator = prevDate !== currentDate;
        prevDate = currentDate;

        return (
          <Fragment key={message.id}>
            {showDateSeparator && (
              <div className="flex justify-center">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  {currentDate}
                </span>
              </div>
            )}
            <MessageBubble message={message} onEdit={onEdit} onDelete={onDelete} onReply={onReply} />
          </Fragment>
        );
      })}
    </div>
  );
}
