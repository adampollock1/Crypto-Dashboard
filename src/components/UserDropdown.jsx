import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, Shield, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const menuItems = [
    { label: 'Profile', icon: User, href: '/account/profile' },
    { label: 'Settings', icon: Settings, href: '/account/settings' },
    { label: 'Security', icon: Shield, href: '/account/security' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-[#1a2332]/50 hover:bg-[#1a2332] border border-white/5 hover:border-white/10 transition-all duration-200"
      >
        <Avatar src={user?.avatar} name={user?.name} size="sm" showRing={false} />
        <span className="text-sm font-medium text-white max-w-[100px] truncate hidden sm:block">
          {user?.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#a1a7bb] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 glass-card-solid rounded-xl shadow-2xl shadow-black/30 overflow-hidden z-50 animate-fade-in-scale">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Avatar src={user?.avatar} name={user?.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user?.name}</p>
                <p className="text-[#a1a7bb] text-xs truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[#a1a7bb] hover:text-white hover:bg-white/5 transition-colors duration-200"
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="py-1 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[#ea3943] hover:bg-[#ea3943]/10 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
