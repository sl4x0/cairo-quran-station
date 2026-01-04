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
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 rounded-3xl max-w-md w-full text-center space-y-6 glow-white"
          >
            <div className="text-6xl">☪️</div>
            <h1 className="text-2xl font-bold text-foreground">
              عذراً، حدث خطأ غير متوقع
            </h1>
            <p className="text-muted-foreground text-lg">
              نعتذر عن هذا الإزعاج. يرجى تحديث الصفحة للمحاولة مرة أخرى.
            </p>
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
