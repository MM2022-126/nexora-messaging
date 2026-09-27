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
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 dark:bg-slate-950">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-2">
        <div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-200">
              <Sparkles className="h-3.5 w-3.5" />
              Demo messaging
            </div>
            <h1 className="mt-8 text-4xl font-semibold">Private chats for teams and friends.</h1>
            <p className="mt-3 max-w-md text-slate-300 ">This is a client-side demo app using browser localStorage and serverless APIs for Vercel deployment only.</p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-500/20 p-3 text-sky-300"><MessageCircleHeart className="h-5 w-5" /></div>
              <div>
                <p className="text-lg font-semibold">Fast, secure, and local</p>
                <p className="text-sm text-slate-400">No external database required.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-md">
            <div className="flex items-center justify-between rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800">
              <button type="button" onClick={() => setMode('login')} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${mode === 'login' ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950' : 'text-slate-500 dark:text-slate-300'}`}>
                Log in
              </button>
              <button type="button" onClick={() => setMode('register')} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${mode === 'register' ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950' : 'text-slate-500 dark:text-slate-300'}`}>
                Register
              </button>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/60">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-sky-100 p-3 text-sky-500 dark:bg-sky-500/10 dark:text-sky-300"><LockKeyhole className="h-5 w-5" /></div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{mode === 'login' ? 'Access your workspace' : 'Set up your demo profile'}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <label className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                    Full name
                    <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900" placeholder="Jane Smith" />
                  </label>
                )}

                <label className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                  {mode === 'register' ? 'Username' : 'Username or email'}
                  <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900" placeholder={mode === 'register' ? 'janesmith' : 'janesmith or jane@example.com'} />
                </label>

                {mode === 'register' && (
                  <label className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                    Email
                    <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900" placeholder="jane@example.com" />
                  </label>
                )}

                <label className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                  Password
                  <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900" placeholder="••••••••" />
                </label>

                <button type="submit" disabled={busy} className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
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
