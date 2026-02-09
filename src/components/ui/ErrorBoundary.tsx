import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleRetry = () => {
        window.location.reload();
    };

    private handleGoHome = () => {
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
                    <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1a202c' }}>Something went wrong</h1>
                        <p style={{ marginBottom: '1.5rem', color: '#4a5568' }}>
                            We encountered an unexpected error.
                        </p>

                        {this.state.error && (
                            <pre style={{ backgroundColor: '#f7fafc', padding: '1rem', borderRadius: '0.25rem', fontSize: '0.75rem', overflowX: 'auto', marginBottom: '1.5rem', color: '#e53e3e' }}>
                                {this.state.error.toString()}
                            </pre>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={this.handleGoHome}
                                style={{ padding: '0.5rem 1rem', borderRadius: '0.25rem', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}
                            >
                                Go Home
                            </button>
                            <button
                                onClick={this.handleRetry}
                                style={{ padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer' }}
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
