import { Search } from 'lucide-react';

export default function UserSearch({ value, onChange, placeholder = 'Search users...' }) {
  return (
    <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-500 transition focus-within:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
      <Search className="h-4 w-4" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border-none bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
        placeholder={placeholder}
        aria-label="Search users"
      />
    </label>
  );
}
