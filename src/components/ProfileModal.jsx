import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function ProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  useEffect(() => {
    setForm({
      name: user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    });
  }, [user]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Edit profile</h3>
          <button type="button" onClick={onClose} aria-label="Close profile editor" className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
            Name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-800" />
          </label>
          <label className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
            Username
            <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-800" />
          </label>
          <label className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
            Email
            <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-800" />
          </label>
          <label className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
            Bio
            <textarea rows={3} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-800" />
          </label>
          <label className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
            Avatar URL
            <input value={form.avatar} onChange={(event) => setForm({ ...form, avatar: event.target.value })} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-800" />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">Cancel</button>
          <button type="button" onClick={() => onSave(form)} className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white">Save changes</button>
        </div>
      </div>
    </div>
  );
}
