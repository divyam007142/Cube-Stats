import React from 'react';
import { motion } from 'framer-motion';
import { Package, Puzzle } from 'lucide-react';

const PluginsCard = ({ serverData }) => {
  const plugins = serverData?.plugins || [];
  const mods = serverData?.mods || [];

  if (plugins.length === 0 && mods.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl hover:border-primary/50 p-6"
        data-testid="plugins-card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold font-mono tracking-tight">PLUGINS & MODS</h3>
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div className="text-center text-muted-foreground py-8">
          <Puzzle className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No plugins or mods information available</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl hover:border-primary/50 p-6"
      data-testid="plugins-card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold font-mono tracking-tight">PLUGINS & MODS</h3>
        <Package className="h-6 w-6 text-primary" />
      </div>

      <div className="space-y-6">
        {plugins.length > 0 && (
          <div>
            <h4 className="text-sm font-mono text-muted-foreground mb-3 uppercase tracking-wider">
              Plugins ({plugins.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto scrollbar-custom" data-testid="plugins-list">
              {plugins.map((plugin, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/10 hover:border-primary/50 hover:bg-white/10"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-mono text-sm truncate">{plugin}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {mods.length > 0 && (
          <div>
            <h4 className="text-sm font-mono text-muted-foreground mb-3 uppercase tracking-wider">
              Mods ({mods.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto scrollbar-custom" data-testid="mods-list">
              {mods.map((mod, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/10 hover:border-secondary/50 hover:bg-white/10"
                >
                  <div className="h-2 w-2 rounded-full bg-secondary" />
                  <span className="font-mono text-sm truncate">{mod}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PluginsCard;