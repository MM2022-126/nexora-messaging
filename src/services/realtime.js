const CHANNEL_NAME = 'messaging-realtime';

export function emitRealtimeEvent(type, payload = {}) {
  if (typeof window === 'undefined') return;

  const event = { type, payload, timestamp: Date.now() };

  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(event);
    channel.close();
  }

  window.localStorage.setItem(`messaging_realtime_${type}`, JSON.stringify(event));
}

export function subscribeToRealtime(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleStorage = (event) => {
    if (!event.key || !event.key.startsWith('messaging_realtime_')) return;
    if (!event.newValue) return;

    try {
      const parsed = JSON.parse(event.newValue);
      callback(parsed);
    } catch (error) {
      // Ignore malformed storage payloads.
    }
  };

  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null;

  if (channel) {
    channel.onmessage = (event) => callback(event.data);
  }

  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener('storage', handleStorage);
    if (channel) {
      channel.close();
    }
  };
}
