import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0d1421] flex items-center justify-center p-4">
          <div className="bg-[#1a2332] rounded-2xl p-8 max-w-lg w-full border border-[#ea3943]/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ea3943]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#ea3943]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
              <p className="text-[#a1a7bb] mb-4">
                An error occurred while loading the application.
              </p>
              {this.state.error && (
                <pre className="text-left text-xs text-[#ea3943] bg-[#0d1421] p-4 rounded-lg overflow-auto max-h-40 mb-4">
                  {this.state.error.toString()}
                </pre>
              )}
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#3861fb] hover:bg-[#3861fb]/80 text-white rounded-lg transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
