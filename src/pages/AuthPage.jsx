import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LockKeyhole, MessageCircleHeart, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const initialForm = {
  name: '',
  username: '',
  email: '',
  password: '',
};

export default function AuthPage() {
  const { currentUser, register, login } = useAuth();
  const { success, error } = useNotifications();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);

    try {
      if (mode === 'register') {
        await register(form);
        success('Registration complete. Welcome aboard!');
      } else {
        await login({ username: form.username || form.email, password: form.password });
        success('Signed in successfully.');
      }
    } catch (submissionError) {
      error(submissionError.message || 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f1ea] px-4 py-12 dark:bg-[#1d1715]">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-[#e9dacc] bg-[#fffaf5] shadow-soft dark:border-[#3d312d] dark:bg-[#2a221f] lg:grid-cols-2">
        <div className="hidden bg-[radial-gradient(circle_at_top_left,_#e9a98c,_#c7654e_38%,_#2d201d_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#fef7f2]">
              <Sparkles className="h-3.5 w-3.5" />
              Demo messaging
            </div>
            <h1 className="mt-8 text-4xl font-semibold text-white">Private chats for teams and friends.</h1>
            <p className="mt-3 max-w-md text-[#f5dfd5]">Simple, focused conversations designed to feel warm and easy to use.</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/10 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/15 p-3 text-[#fee9e0]"><MessageCircleHeart className="h-5 w-5" /></div>
              <div>
                <p className="text-lg font-semibold text-white">Warm, human, and easy</p>
                <p className="text-sm text-[#f0d3c8]">Built for everyday connection.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-md">
            <div className="flex items-center justify-between rounded-full border border-[#ecd9cc] bg-[#f7efe6] p-1 dark:border-[#423632] dark:bg-[#352f2d]">
              <button type="button" onClick={() => setMode('login')} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${mode === 'login' ? 'bg-[#d9775f] text-white shadow-sm' : 'text-[#725f58] dark:text-[#ebd5cb]'}`}>
                Log in
              </button>
              <button type="button" onClick={() => setMode('register')} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${mode === 'register' ? 'bg-[#d9775f] text-white shadow-sm' : 'text-[#725f58] dark:text-[#ebd5cb]'}`}>
                Register
              </button>
            </div>

            <div className="mt-8 rounded-3xl border border-[#ecd9cc] bg-[#f8f0e8] p-5 dark:border-[#433935] dark:bg-[#332d2b]">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-[#fbe3da] p-3 text-[#c7654e] dark:bg-[#3d2a25] dark:text-[#f0b39d]"><LockKeyhole className="h-5 w-5" /></div>
                <div>
                  <h2 className="text-xl font-semibold text-[#2f241f] dark:text-[#f7efe9]">{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
                  <p className="text-sm text-[#725f58] dark:text-[#d7c1b5]">{mode === 'login' ? 'Access your workspace' : 'Set up your demo profile'}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <label className="grid gap-1 text-sm text-[#5a4844] dark:text-[#ebd5cb]">
                    Full name
                    <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="rounded-2xl border border-[#eadbcf] bg-white px-3 py-2.5 outline-none focus:border-[#d9775f] dark:border-[#524a46] dark:bg-[#261f1d]" placeholder="Jane Smith" />
                  </label>
                )}

                <label className="grid gap-1 text-sm text-[#5a4844] dark:text-[#ebd5cb]">
                  {mode === 'register' ? 'Username' : 'Username or email'}
                  <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} className="rounded-2xl border border-[#eadbcf] bg-white px-3 py-2.5 outline-none focus:border-[#d9775f] dark:border-[#524a46] dark:bg-[#261f1d]" placeholder={mode === 'register' ? 'janesmith' : 'janesmith or jane@example.com'} />
                </label>

                {mode === 'register' && (
                  <label className="grid gap-1 text-sm text-[#5a4844] dark:text-[#ebd5cb]">
                    Email
                    <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="rounded-2xl border border-[#eadbcf] bg-white px-3 py-2.5 outline-none focus:border-[#d9775f] dark:border-[#524a46] dark:bg-[#261f1d]" placeholder="jane@example.com" />
                  </label>
                )}

                <label className="grid gap-1 text-sm text-[#5a4844] dark:text-[#ebd5cb]">
                  Password
                  <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="rounded-2xl border border-[#eadbcf] bg-white px-3 py-2.5 outline-none focus:border-[#d9775f] dark:border-[#524a46] dark:bg-[#261f1d]" placeholder="••••••••" />
                </label>

                <button type="submit" disabled={busy} className="w-full rounded-2xl bg-[#d9775f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c7654e] disabled:cursor-not-allowed disabled:opacity-60">
                  {busy ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
