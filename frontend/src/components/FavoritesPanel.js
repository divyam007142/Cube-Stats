import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trash2, StarOff } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

const FavoritesPanel = ({ favorites, onSelectServer, onRemoveFavorite }) => {
  if (!favorites || favorites.length === 0) {
    return (
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6" data-testid="favorites-panel">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold font-mono">FAVORITES</h3>
        </div>
        <div className="text-center text-muted-foreground py-8">
          <StarOff className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No favorite servers yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6" data-testid="favorites-panel">
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold font-mono">FAVORITES</h3>
      </div>

      <ScrollArea className="h-[400px]" data-testid="favorites-list">
        <div className="space-y-2">
          {favorites.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 p-3 rounded border border-white/10 hover:border-primary/50 group"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onSelectServer(item.ip, item.port)}
                  className="flex-1 text-left"
                >
                  <p className="font-mono text-sm font-semibold group-hover:text-primary">
                    {item.hostname || item.ip}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {item.ip}:{item.port}
                  </p>
                </button>
                <Button
                  onClick={() => onRemoveFavorite(item.id)}
                  variant="ghost"
                  size="sm"
                  data-testid={`remove-favorite-${item.id}`}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FavoritesPanel;