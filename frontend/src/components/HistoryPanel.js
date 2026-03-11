import React from 'react';
import { motion } from 'framer-motion';
import { History, Clock, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

const HistoryPanel = ({ history, onSelectServer, onClearHistory }) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6" data-testid="history-panel">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold font-mono">HISTORY</h3>
          </div>
        </div>
        <div className="text-center text-muted-foreground py-8">
          <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No scan history yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6" data-testid="history-panel">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold font-mono">HISTORY</h3>
        </div>
        {history.length > 0 && (
          <Button
            onClick={onClearHistory}
            variant="ghost"
            size="sm"
            data-testid="clear-history-button"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="h-[400px]" data-testid="history-list">
        <div className="space-y-2">
          {history.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectServer(item.ip, item.port)}
              className="w-full text-left bg-white/5 hover:bg-white/10 p-3 rounded border border-white/10 hover:border-primary/50 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-mono text-sm font-semibold group-hover:text-primary">
                    {item.hostname || item.ip}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {item.ip}:{item.port}
                  </p>
                </div>
                <Clock className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </motion.button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HistoryPanel;