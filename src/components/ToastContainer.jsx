import { useNotifications } from '../context/NotificationContext';
import Toast from './Toast';

export default function ToastContainer() {
  const { toasts, dismissToast } = useNotifications();

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-3">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onClose={dismissToast} />
        </div>
      ))}
    </div>
  );
}
