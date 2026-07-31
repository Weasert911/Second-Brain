import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen bg-[#0D0D0D] items-center justify-center p-8">
          <div className="max-w-md w-full">
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
              <h1 className="text-xl font-bold text-[#E05454] mb-3">Something went wrong</h1>
              <p className="text-sm text-[#B0B0B0] mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              {this.state.errorInfo && (
                <details className="mb-4">
                  <summary className="text-xs text-[#666666] cursor-pointer hover:text-[#B0B0B0]">
                    Error details
                  </summary>
                  <pre className="mt-2 text-xs text-[#666666] bg-[#0D0D0D] p-3 rounded overflow-auto max-h-40">
                    {this.state.error?.stack}
                  </pre>
                </details>
              )}
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.reload();
                }}
                className="px-4 py-2 bg-[#C8FF00] text-[#0D0D0D] text-sm font-medium rounded hover:bg-[#B8E600]"
              >
                Reload App
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
