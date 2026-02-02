import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  User,
  Settings,
  Shield,
  Camera,
  Save,
  Bell,
  Moon,
  DollarSign,
  Download,
  Upload,
  Trash2,
  Lock,
  Smartphone,
  LogOut,
  AlertCircle,
  Check,
  X,
  Eye,
  EyeOff,
  Copy,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';
import { useWatchlist } from '../context/WatchlistContext';
import Avatar from '../components/Avatar';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'security', label: 'Security', icon: Shield },
];

// Toggle Switch Component
const Toggle = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-white font-medium">{label}</p>
      {description && <p className="text-[#a1a7bb] text-sm mt-0.5">{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
        enabled ? 'bg-[#00d4aa]' : 'bg-[#242d3d]'
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

// Confirmation Modal Component
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, danger }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#1a2332] rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-2xl animate-fade-in-scale">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-[#a1a7bb] mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#242d3d] text-white font-medium rounded-xl hover:bg-[#2a3548] transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 font-medium rounded-xl transition-all duration-200 ${
              danger
                ? 'bg-[#ea3943] text-white hover:bg-[#ea3943]/80'
                : 'bg-[#00d4aa] text-white hover:bg-[#00d4aa]/80'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Profile Tab Component
const ProfileTab = () => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 2MB' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile({ name, bio, avatar });
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#0d1421] rounded-xl border border-white/5">
        <div className="relative group">
          <Avatar src={avatar} name={name || user?.name} size="3xl" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <Camera className="w-8 h-8 text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold text-white">{name || user?.name}</h3>
          <p className="text-[#a1a7bb]">{user?.email}</p>
          <p className="text-[#a1a7bb] text-sm mt-1">
            Member since {formatDate(user?.createdAt)}
          </p>
          {avatar && (
            <button
              onClick={() => setAvatar(null)}
              className="mt-2 text-sm text-[#ea3943] hover:text-[#ea3943]/80 transition-colors"
            >
              Remove avatar
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#a1a7bb] mb-2">
            Display name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-[#0d1421] border border-white/10 rounded-xl text-white placeholder-[#a1a7bb]/50 focus:outline-none focus:border-[#00d4aa]/50 focus:ring-2 focus:ring-[#00d4aa]/20 transition-all duration-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#a1a7bb] mb-2">
            Email address
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-3 bg-[#0d1421]/50 border border-white/5 rounded-xl text-[#a1a7bb] cursor-not-allowed"
          />
          <p className="text-xs text-[#a1a7bb] mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#a1a7bb] mb-2">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tell us about yourself..."
            className="w-full px-4 py-3 bg-[#0d1421] border border-white/10 rounded-xl text-white placeholder-[#a1a7bb]/50 focus:outline-none focus:border-[#00d4aa]/50 focus:ring-2 focus:ring-[#00d4aa]/20 transition-all duration-300 resize-none"
          />
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${
            message.type === 'success'
              ? 'bg-[#00d4aa]/10 border border-[#00d4aa]/20'
              : 'bg-[#ea3943]/10 border border-[#ea3943]/20'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="w-5 h-5 text-[#00d4aa]" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#ea3943]" />
          )}
          <p className={message.type === 'success' ? 'text-[#00d4aa]' : 'text-[#ea3943]'}>
            {message.text}
          </p>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#00d4aa] to-[#00b894] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#00d4aa]/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSaving ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save changes
          </>
        )}
      </button>
    </div>
  );
};

// Settings Tab Component
const SettingsTab = () => {
  const { user, updateProfile } = useAuth();
  const { holdings, clearPortfolio } = usePortfolio();
  const { watchlist, clearWatchlist } = useWatchlist();
  const [preferences, setPreferences] = useState(user?.preferences || {});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showClearModal, setShowClearModal] = useState(false);

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNotification = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile({ preferences });
      setMessage({ type: 'success', text: 'Settings saved successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const data = {
      portfolio: holdings,
      watchlist: watchlist,
      preferences: preferences,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cryptovue-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setMessage({ type: 'success', text: 'Data exported successfully' });
  };

  const handleClearAll = () => {
    clearPortfolio();
    clearWatchlist();
    setShowClearModal(false);
    setMessage({ type: 'success', text: 'All data cleared successfully' });
  };

  return (
    <div className="space-y-8">
      {/* Display Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#00d4aa]" />
          Display Preferences
        </h3>
        <div className="p-4 bg-[#0d1421] rounded-xl border border-white/5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#a1a7bb] mb-2">
              Default Currency
            </label>
            <select
              value={preferences.currency || 'USD'}
              onChange={(e) => updatePreference('currency', e.target.value)}
              className="w-full px-4 py-3 bg-[#1a2332] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00d4aa]/50 transition-all duration-300 cursor-pointer"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-white font-medium flex items-center gap-2">
                <Moon className="w-4 h-4" />
                Dark Theme
              </p>
              <p className="text-[#a1a7bb] text-sm mt-0.5">Always enabled</p>
            </div>
            <div className="w-12 h-6 rounded-full bg-[#00d4aa] flex items-center justify-end pr-1">
              <div className="w-4 h-4 rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#00d4aa]" />
          Notifications
        </h3>
        <div className="p-4 bg-[#0d1421] rounded-xl border border-white/5 divide-y divide-white/5">
          <Toggle
            enabled={preferences.notifications?.priceAlerts ?? true}
            onChange={(v) => updateNotification('priceAlerts', v)}
            label="Price Alerts"
            description="Get notified when prices change significantly"
          />
          <Toggle
            enabled={preferences.notifications?.news ?? false}
            onChange={(v) => updateNotification('news', v)}
            label="News Updates"
            description="Receive crypto news and market updates"
          />
          <Toggle
            enabled={preferences.notifications?.email ?? true}
            onChange={(v) => updateNotification('email', v)}
            label="Email Notifications"
            description="Receive notifications via email"
          />
        </div>
      </div>

      {/* Data Management */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-[#00d4aa]" />
          Data Management
        </h3>
        <div className="p-4 bg-[#0d1421] rounded-xl border border-white/5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExport}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#242d3d] text-white font-medium rounded-xl hover:bg-[#2a3548] transition-colors duration-200"
            >
              <Download className="w-5 h-5" />
              Export Data
            </button>
            <button
              onClick={() => setShowClearModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#ea3943]/10 text-[#ea3943] font-medium rounded-xl hover:bg-[#ea3943]/20 border border-[#ea3943]/20 transition-colors duration-200"
            >
              <Trash2 className="w-5 h-5" />
              Clear All Data
            </button>
          </div>
          <p className="text-[#a1a7bb] text-sm">
            Export your portfolio and watchlist data, or clear all local data.
          </p>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${
            message.type === 'success'
              ? 'bg-[#00d4aa]/10 border border-[#00d4aa]/20'
              : 'bg-[#ea3943]/10 border border-[#ea3943]/20'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="w-5 h-5 text-[#00d4aa]" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#ea3943]" />
          )}
          <p className={message.type === 'success' ? 'text-[#00d4aa]' : 'text-[#ea3943]'}>
            {message.text}
          </p>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#00d4aa] to-[#00b894] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#00d4aa]/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSaving ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save settings
          </>
        )}
      </button>

      {/* Clear Data Modal */}
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearAll}
        title="Clear All Data"
        message="This will permanently delete your portfolio and watchlist data. This action cannot be undone."
        confirmText="Clear All"
        danger
      />
    </div>
  );
};

// Security Tab Component
const SecurityTab = () => {
  const { user, updatePassword, toggleTwoFactor, deleteAccount, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setIsChangingPassword(true);

    try {
      await updatePassword(currentPassword, newPassword);
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to change password' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleToggle2FA = async (enabled) => {
    try {
      await toggleTwoFactor(enabled);
      setMessage({
        type: 'success',
        text: enabled ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled',
      });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setMessage({ type: 'error', text: 'Please enter your password' });
      return;
    }

    setIsDeleting(true);

    try {
      await deleteAccount(deletePassword);
      navigate('/');
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete account' });
      setIsDeleting(false);
    }
  };

  const handleLogoutAll = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Simulated QR code for 2FA demo
  const qrCodeData = 'DEMO2FASECRETKEY123';

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#00d4aa]" />
          Change Password
        </h3>
        <form onSubmit={handleChangePassword} className="p-4 bg-[#0d1421] rounded-xl border border-white/5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#a1a7bb] mb-2">
              Current password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-[#1a2332] border border-white/10 rounded-xl text-white placeholder-[#a1a7bb]/50 focus:outline-none focus:border-[#00d4aa]/50 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a1a7bb] hover:text-white"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a7bb] mb-2">
              New password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-[#1a2332] border border-white/10 rounded-xl text-white placeholder-[#a1a7bb]/50 focus:outline-none focus:border-[#00d4aa]/50 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a1a7bb] hover:text-white"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a7bb] mb-2">
              Confirm new password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a2332] border border-white/10 rounded-xl text-white placeholder-[#a1a7bb]/50 focus:outline-none focus:border-[#00d4aa]/50 transition-all duration-300"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-[#a1a7bb]">
            <span>Last changed: {formatDate(user?.security?.lastPasswordChange)}</span>
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full py-3 bg-[#242d3d] text-white font-medium rounded-xl hover:bg-[#2a3548] transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isChangingPassword ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Changing...
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-[#00d4aa]" />
          Two-Factor Authentication
        </h3>
        <div className="p-4 bg-[#0d1421] rounded-xl border border-white/5">
          <Toggle
            enabled={user?.security?.twoFactorEnabled ?? false}
            onChange={handleToggle2FA}
            label="Enable 2FA"
            description="Add an extra layer of security to your account"
          />

          {user?.security?.twoFactorEnabled && (
            <div className="mt-4 p-4 bg-[#1a2332] rounded-xl border border-white/5">
              <p className="text-[#a1a7bb] text-sm mb-3">
                Scan this QR code with your authenticator app (demo only):
              </p>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#0d1421] to-[#1a2332] rounded grid grid-cols-5 gap-0.5 p-1">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${Math.random() > 0.5 ? 'bg-[#0d1421]' : 'bg-white'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[#a1a7bb] text-xs mb-1">Manual entry code:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-[#00d4aa] font-mono text-sm bg-[#0d1421] px-3 py-2 rounded-lg">
                      {qrCodeData}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(qrCodeData)}
                      className="p-2 text-[#a1a7bb] hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sessions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <LogOut className="w-5 h-5 text-[#00d4aa]" />
          Sessions
        </h3>
        <div className="p-4 bg-[#0d1421] rounded-xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between p-3 bg-[#1a2332] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00d4aa]/20 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-[#00d4aa]" />
              </div>
              <div>
                <p className="text-white font-medium">Current Session</p>
                <p className="text-[#a1a7bb] text-sm">This browser</p>
              </div>
            </div>
            <span className="text-xs text-[#00d4aa] bg-[#00d4aa]/10 px-2 py-1 rounded-full">
              Active
            </span>
          </div>

          <button
            onClick={handleLogoutAll}
            className="w-full py-3 bg-[#242d3d] text-white font-medium rounded-xl hover:bg-[#2a3548] transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout from all devices
          </button>
        </div>
      </div>

      {/* Delete Account */}
      <div>
        <h3 className="text-lg font-semibold text-[#ea3943] mb-4 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Danger Zone
        </h3>
        <div className="p-4 bg-[#ea3943]/5 rounded-xl border border-[#ea3943]/20">
          <p className="text-[#a1a7bb] mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-3 bg-[#ea3943]/10 text-[#ea3943] font-medium rounded-xl hover:bg-[#ea3943]/20 border border-[#ea3943]/20 transition-colors duration-200"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${
            message.type === 'success'
              ? 'bg-[#00d4aa]/10 border border-[#00d4aa]/20'
              : 'bg-[#ea3943]/10 border border-[#ea3943]/20'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="w-5 h-5 text-[#00d4aa]" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#ea3943]" />
          )}
          <p className={message.type === 'success' ? 'text-[#00d4aa]' : 'text-[#ea3943]'}>
            {message.text}
          </p>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowDeleteModal(false)}
        >
          <div className="bg-[#1a2332] rounded-2xl p-6 w-full max-w-md border border-[#ea3943]/20 shadow-2xl animate-fade-in-scale">
            <h3 className="text-xl font-bold text-white mb-2">Delete Account</h3>
            <p className="text-[#a1a7bb] mb-4">
              This will permanently delete your account and all associated data. Enter your password to confirm.
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-[#0d1421] border border-white/10 rounded-xl text-white placeholder-[#a1a7bb]/50 focus:outline-none focus:border-[#ea3943]/50 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                }}
                className="flex-1 py-3 bg-[#242d3d] text-white font-medium rounded-xl hover:bg-[#2a3548] transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 py-3 bg-[#ea3943] text-white font-medium rounded-xl hover:bg-[#ea3943]/80 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Account'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Account Page
const AccountPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeTab = tab || 'profile';

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: { pathname: '/account' } }} replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00d4aa] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'settings':
        return <SettingsTab />;
      case 'security':
        return <SecurityTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-page-enter">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-[#a1a7bb]">Manage your profile, preferences, and security settings</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => navigate(`/account/${t.id}`)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-gradient-to-r from-[#00d4aa]/20 to-[#3861fb]/20 text-white border border-[#00d4aa]/30'
                : 'text-[#a1a7bb] hover:text-white hover:bg-white/5'
            }`}
          >
            <t.icon className={`w-4 h-4 ${activeTab === t.id ? 'text-[#00d4aa]' : ''}`} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-[#1a2332]/50 backdrop-blur-sm rounded-2xl border border-white/5 p-6 sm:p-8">
        {renderTab()}
      </div>
    </div>
  );
};

export default AccountPage;
