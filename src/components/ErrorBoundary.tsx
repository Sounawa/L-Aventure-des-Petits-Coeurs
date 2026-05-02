'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-6"
          >
            <motion.span
              className="text-6xl block"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🪞
            </motion.span>
            <h1 className="text-2xl font-bold text-foreground">
              Oups ! Un petit pépin... ✨
            </h1>
            <p className="text-muted-foreground">
              Le miroir magique a besoin d&apos;un instant pour se réparer. Essaie de recharger la page !
            </p>
            {this.state.error && (
              <details className="text-left bg-muted/50 rounded-xl p-3 border border-border/30">
                <summary className="text-xs text-muted-foreground cursor-pointer font-medium">
                  Détails techniques
                </summary>
                <pre className="text-[10px] text-muted-foreground/70 mt-2 overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleReset} variant="outline">
                🔄 Réessayer
              </Button>
              <Button onClick={this.handleReload}
                style={{ background: 'linear-gradient(135deg, #C9A227, #E8D44D)', color: '#3D2C1E' }}
              >
                ✨ Recharger
              </Button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
