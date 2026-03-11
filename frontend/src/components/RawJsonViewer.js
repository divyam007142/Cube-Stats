import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';

const RawJsonViewer = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl hover:border-primary/50"
      data-testid="raw-json-viewer"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold font-mono tracking-tight">RAW JSON</h3>
          </div>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            size="sm"
            data-testid="toggle-json-button"
            className="border-primary/30 hover:border-primary hover:bg-primary/10 font-mono"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                COLLAPSE
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                EXPAND
              </>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <pre className="bg-black/80 p-4 rounded-lg border border-white/10 text-xs font-mono overflow-x-auto scrollbar-custom max-h-96 overflow-y-auto" data-testid="json-content">
                <code className="text-primary/80">{JSON.stringify(data, null, 2)}</code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RawJsonViewer;