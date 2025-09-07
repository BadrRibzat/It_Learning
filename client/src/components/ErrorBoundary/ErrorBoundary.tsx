// src/components/ErrorBoundary/ErrorBoundary.tsx
import React, { Component, type ErrorInfo } from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error caught by boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const { t } = this.props as any; // Hack to access t in class component
      return (
        <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>
          <h2>{t('error_boundary.title')}</h2>
          <p>{t('error_boundary.message')}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC to inject t into class component
const withTranslation = (WrappedComponent: any) => {
  return (props: any) => {
    const { t } = useTranslation();
    return <WrappedComponent {...props} t={t} />;
  };
};

export default withTranslation(ErrorBoundary);
