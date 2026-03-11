import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, WifiOff, ServerCrash } from 'lucide-react';
import { Button } from './ui/button';

const ErrorDisplay = ({ error, onRetry }) => {
  const getErrorIcon = () => {
    if (error?.includes('offline')) return <WifiOff className="h-16 w-16 text-destructive" />;
    if (error?.includes('timeout')) return <ServerCrash className="h-16 w-16 text-destructive" />;
    return <AlertCircle className="h-16 w-16 text-destructive" />;
  };

  const getErrorTitle = () => {
    if (error?.includes('offline')) return 'Server Offline';
    if (error?.includes('timeout')) return 'Connection Timeout';
    if (error?.includes('Network error')) return 'Network Error';
    return 'Scan Failed';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto"
      data-testid="error-display"
    >
      <div className="bg-black/40 backdrop-blur-xl border border-destructive/50 rounded-xl p-8 text-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex justify-center mb-6"
        >
          {getErrorIcon()}
        </motion.div>

        <h3 className="text-2xl font-bold font-mono mb-3 text-destructive" data-testid="error-title">
          {getErrorTitle()}
        </h3>

        <p className="text-muted-foreground mb-6" data-testid="error-message">
          {error || 'An unexpected error occurred. Please try again.'}
        </p>

        <div className="space-y-3 text-sm text-muted-foreground text-left bg-white/5 p-4 rounded-lg border border-white/10 mb-6">
          <p className="font-mono">• Verify the server IP address is correct</p>
          <p className="font-mono">• Check that the port number is accurate (default: 25565)</p>
          <p className="font-mono">• Ensure the server is online and accessible</p>
          <p className="font-mono">• The server might have query disabled</p>
        </div>

        {onRetry && (
          <Button
            onClick={onRetry}
            data-testid="retry-button"
            className="bg-primary text-black font-bold hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(0,255,163,0.6)] px-8 font-mono"
          >
            TRY AGAIN
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorDisplay;