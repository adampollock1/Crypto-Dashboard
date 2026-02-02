import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state, default to home
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to login');
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

        {/* Login Card */}
        <div className="bg-[#1a2332]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl shadow-black/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-[#a1a7bb] text-sm">Sign in to your account to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-[#ea3943]/10 border border-[#ea3943]/20 rounded-xl flex items-center gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-[#ea3943] flex-shrink-0" />
              <p className="text-[#ea3943] text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="Enter your password"
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border transition-all duration-200 flex items-center justify-center ${
                      rememberMe
                        ? 'bg-[#00d4aa] border-[#00d4aa]'
                        : 'border-white/20 bg-transparent group-hover:border-white/40'
                    }`}
                  >
                    {rememberMe && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-[#a1a7bb] group-hover:text-white transition-colors duration-200">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-[#00d4aa] hover:text-[#00d4aa]/80 transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-[#00d4aa] to-[#00b894] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#00d4aa]/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign in
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

          {/* Sign Up Link */}
          <p className="text-center text-[#a1a7bb]">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[#00d4aa] hover:text-[#00d4aa]/80 font-medium transition-colors duration-200"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-[#3861fb]/10 border border-[#3861fb]/20 rounded-xl">
          <p className="text-[#a1a7bb] text-sm text-center">
            <span className="text-[#3861fb] font-medium">Demo Mode:</span> Create any account to explore the features. Data is stored locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
