import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorInfo: {
        componentStack: error.componentStack,
        errorBoundary: error.boundary,
        error: error
      }
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    })
    
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          backgroundColor: '#1f2937',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{ color: '#ef4444', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
            ⚠️ Something went wrong
          </div>
          <div style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </div>
          <details style={{ color: '#d1d5db', fontSize: '12px' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
              📋 Error Details
            </summary>
            <div style={{ 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              padding: '12px', 
              borderRadius: '4px',
              marginTop: '8px',
              fontSize: '11px'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>Component:</div>
              <div>{this.state.errorInfo?.componentStack || 'Unknown component'}</div>
              
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>Error Message:</div>
              <div>{this.state.error?.message || 'No error message available'}</div>
              
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>Stack Trace:</div>
              <pre style={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                color: '#f87171', 
                padding: '8px', 
                borderRadius: '4px',
                fontSize: '10px',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {this.state.errorInfo?.error?.stack || 'No stack trace available'}
              </pre>
            </div>
          </details>
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#9ca3af' }}>
            🔄 Please refresh the page to continue
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
