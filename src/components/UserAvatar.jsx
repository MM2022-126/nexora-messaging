export default function UserAvatar({ user, size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  const image = user?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=default';

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full border border-white bg-slate-200 ${sizeMap[size]} ${className}`}>
      <img src={image} alt={user?.name || 'User avatar'} className="h-full w-full object-cover" />
      {user?.isOnline && (
        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" aria-label="Online status" />
      )}
    </div>
  );
}
