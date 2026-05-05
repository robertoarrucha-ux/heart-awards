
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Ocurrió un error inesperado.";
      
      try {
        // Check if it's a Firestore error JSON
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            errorMessage = `Error de base de datos (${parsed.operationType}): ${parsed.error}`;
            if (parsed.error.includes('Missing or insufficient permissions')) {
                errorMessage = "No tienes permisos suficientes para realizar esta acción o ver este contenido.";
            }
          }
        }
      } catch (e) {
        // Not a JSON error, use default or the error message itself
        if (this.state.error?.message) {
            errorMessage = this.state.error.message;
        }
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-background rounded-xl border-2 border-dashed border-muted-foreground/20 m-4">
          <div className="bg-destructive/10 p-4 rounded-full mb-6">
            <AlertCircle className="w-12 h-12 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">¡Vaya! Algo salió mal</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            {errorMessage}
          </p>
          <Button onClick={this.handleReset} className="gap-2">
            <RefreshCcw className="w-4 h-4" />
            Reintentar
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
