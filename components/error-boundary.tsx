"use client";

import type React from "react";

import { Component, type ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log detailed error information
    console.error("=== Error Boundary Caught Error ===");
    console.error("Error:", error);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    console.error("Component Stack:", errorInfo.componentStack);
    console.error("===================================");
    
    // Store error info in state for display
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 rounded-3xl max-w-2xl w-full text-center space-y-6 glow-white"
          >
            <div className="text-6xl">☪️</div>
            <h1 className="text-2xl font-bold text-foreground">
              عذراً، حدث خطأ غير متوقع
            </h1>
            <p className="text-muted-foreground text-lg">
              نعتذر عن هذا الإزعاج. يرجى تحديث الصفحة للمحاولة مرة أخرى.
            </p>
            
            {/* Show error details in development */}
            {isDevelopment && this.state.error && (
              <div className="mt-6 p-4 bg-red-950/50 border border-red-500/50 rounded-lg text-left">
                <h2 className="text-lg font-bold text-red-400 mb-2">Error Details (Development Only):</h2>
                <p className="text-red-300 font-mono text-sm mb-2">
                  <strong>Message:</strong> {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <details className="mt-2">
                    <summary className="text-red-300 cursor-pointer hover:text-red-200">
                      Stack Trace
                    </summary>
                    <pre className="text-xs text-red-200 mt-2 overflow-auto max-h-64 whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-red-300 cursor-pointer hover:text-red-200">
                      Component Stack
                    </summary>
                    <pre className="text-xs text-red-200 mt-2 overflow-auto max-h-64 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="glass-panel px-8 py-4 rounded-full font-bold text-primary hover:bg-primary/10 transition-all elegant-shadow w-full min-h-[44px]"
              aria-label="تحديث الصفحة"
            >
              تحديث الصفحة
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
