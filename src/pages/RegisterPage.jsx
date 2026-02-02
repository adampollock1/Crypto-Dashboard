import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, UserPlus, TrendingUp, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Password strength calculator
const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  score += checks.length ? 1 : 0;
  score += checks.lowercase ? 1 : 0;
  score += checks.uppercase ? 1 : 0;
  score += checks.numbers ? 1 : 0;
  score += checks.special ? 1 : 0;

  if (score <= 2) return { score, label: 'Weak', color: '#ea3943', checks };
  if (score <= 3) return { score, label: 'Fair', color: '#f7931a', checks };
  if (score <= 4) return { score, label: 'Good', color: '#00d4aa', checks };
  return { score, label: 'Strong', color: '#00d4aa', checks };
};

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms of service');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, name, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-page-enter">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00d4aa] to-[#3861fb] rounded-xl flex items-center justify-center shadow-lg shadow-[#00d4aa]/20 transition-transform duration-300 group-hover:scale-105">
                <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-[#00d4aa] to-[#3861fb] rounded-xl blur opacity-30 -z-10" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white tracking-tight">CryptoVue</h1>
              <p className="text-xs text-[#a1a7bb]">Market Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Register Card */}
        <div className="bg-[#1a2332]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl shadow-black/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Create an account</h2>
            <p className="text-[#a1a7bb] text-sm">Start tracking your crypto portfolio today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-[#ea3943]/10 border border-[#ea3943]/20 rounded-xl flex items-center gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-[#ea3943] flex-shrink-0" />
              <p className="text-[#ea3943] text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#a1a7bb] mb-2">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a1a7bb]" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3.5 bg-[#0d1421] border border-white/10 rounded-xl text-white placeholder-[#a1a7bb]/50 focus:outline-none focus:border-[#00d4aa]/50 focus:ring-2 focus:ring-[#00d4aa]/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#a1a7bb] mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a1a7bb]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-[#0d1421] border border-white/10 rounded-xl text-white placeholder-[#a1a7bb]/50 focus:outline-none focus:border-[#00d4aa]/50 focus:ring-2 focus:ring-[#00d4aa]/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#a1a7bb] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a1a7bb]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full pl-12 pr-12 py-3.5 bg-[#0d1421] border border-white/10 rounded-xl text-white placeholder-[#a1a7bb]/50 focus:outline-none focus:border-[#00d4aa]/50 focus:ring-2 focus:ring-[#00d4aa]/20 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a1a7bb] hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-3 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#a1a7bb]">Password strength</span>
                    <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#0d1421] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                        backgroundColor: passwordStrength.color,
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      { key: 'length', label: '8+ characters' },
                      { key: 'uppercase', label: 'Uppercase' },
                      { key: 'lowercase', label: 'Lowercase' },
                      { key: 'numbers', label: 'Number' },
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        className={`flex items-center gap-1.5 text-xs ${
                          passwordStrength.checks?.[key] ? 'text-[#00d4aa]' : 'text-[#a1a7bb]/50'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#a1a7bb] mb-2">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a1a7bb]" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`w-full pl-12 pr-12 py-3.5 bg-[#0d1421] border rounded-xl text-white placeholder-[#a1a7bb]/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-[#ea3943]/50 focus:border-[#ea3943]/50 focus:ring-[#ea3943]/20'
                      : confirmPassword && password === confirmPassword
                      ? 'border-[#00d4aa]/50 focus:border-[#00d4aa]/50 focus:ring-[#00d4aa]/20'
                      : 'border-white/10 focus:border-[#00d4aa]/50 focus:ring-[#00d4aa]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a1a7bb] hover:text-white transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-2 text-xs text-[#ea3943]">Passwords do not match</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-md border transition-all duration-200 flex items-center justify-center ${
                    acceptTerms
                      ? 'bg-[#00d4aa] border-[#00d4aa]'
                      : 'border-white/20 bg-transparent group-hover:border-white/40'
                  }`}
                >
                  {acceptTerms && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-[#a1a7bb] group-hover:text-white/80 transition-colors duration-200">
                I agree to the{' '}
                <button type="button" className="text-[#00d4aa] hover:text-[#00d4aa]/80">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-[#00d4aa] hover:text-[#00d4aa]/80">
                  Privacy Policy
                </button>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-[#00d4aa] to-[#00b894] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#00d4aa]/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1a2332] text-[#a1a7bb]">or</span>
            </div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-[#a1a7bb]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#00d4aa] hover:text-[#00d4aa]/80 font-medium transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-[#3861fb]/10 border border-[#3861fb]/20 rounded-xl">
          <p className="text-[#a1a7bb] text-sm text-center">
            <span className="text-[#3861fb] font-medium">Demo Mode:</span> All data is stored locally in your browser. No real authentication is performed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
