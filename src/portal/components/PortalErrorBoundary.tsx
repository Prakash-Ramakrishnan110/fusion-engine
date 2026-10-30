import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class PortalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, copied: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PortalErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleCopy = () => {
    const errorDetails = `Error: ${this.state.error?.message || 'Unknown error'}\n\nStack:\n${this.state.error?.stack || ''}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack || ''}`;
    navigator.clipboard.writeText(errorDetails);
    this.setState({ copied: true });
    toast.success('Error details copied to clipboard');
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="max-w-xl w-full border-destructive/30 bg-card/90 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    Module Rendering Interrupted
                  </CardTitle>
                  <CardDescription className="text-xs">
                    This portal view encountered an unexpected state, but your session is safe.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-muted/60 border border-border/60 font-mono text-[11px] text-destructive overflow-x-auto max-h-36">
                {this.state.error?.message || 'An unexpected rendering error occurred.'}
              </div>

              <p className="text-muted-foreground text-[11px] leading-relaxed">
                You can reload the current view, reset the view state, or copy the error report for review.
              </p>
            </CardContent>

            <CardFooter className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border/40">
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleCopy}
                className="text-xs gap-1.5 h-8"
              >
                {this.state.copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{this.state.copied ? 'Copied' : 'Copy Details'}</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={this.handleReset}
                  className="text-xs h-8"
                >
                  Try Again
                </Button>
                <Button
                  size="sm"
                  onClick={this.handleReload}
                  className="text-xs gap-1.5 h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reload Page</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PortalErrorBoundary;
