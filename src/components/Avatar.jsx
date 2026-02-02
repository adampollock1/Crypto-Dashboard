import { useMemo } from 'react';

// Generate a consistent color based on a string
const stringToColor = (str) => {
  if (!str) return '#3861fb';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#00d4aa', // green
    '#3861fb', // blue
    '#f7931a', // orange
    '#9b59b6', // purple
    '#e74c3c', // red
    '#1abc9c', // teal
    '#e91e63', // pink
    '#00bcd4', // cyan
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

// Get initials from a name
const getInitials = (name) => {
  if (!name) return '?';
  
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
  '3xl': 'w-24 h-24 text-3xl',
};

const Avatar = ({ 
  src, 
  name = '', 
  size = 'md', 
  className = '',
  showRing = true,
  onClick,
}) => {
  const initials = useMemo(() => getInitials(name), [name]);
  const bgColor = useMemo(() => stringToColor(name), [name]);
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  const ringClass = showRing ? 'ring-2 ring-white/10' : '';
  const clickClass = onClick ? 'cursor-pointer hover:ring-white/20 transition-all duration-200' : '';

  if (src) {
    return (
      <div
        className={`${sizeClass} rounded-full overflow-hidden ${ringClass} ${clickClass} ${className}`}
        onClick={onClick}
      >
        <img
          src={src}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-semibold text-white ${ringClass} ${clickClass} ${className}`}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      {initials}
    </div>
  );
};

export default Avatar;
