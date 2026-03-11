import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

const BulkExport = ({ favorites, history }) => {
  const exportFavorites = () => {
    if (!favorites || favorites.length === 0) {
      toast.error('No favorites to export');
      return;
    }

    const exportData = {
      exported_at: new Date().toISOString(),
      total_favorites: favorites.length,
      favorites: favorites.map(fav => ({
        ip: fav.ip,
        port: fav.port,
        hostname: fav.hostname,
        added_at: fav.added_at
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cubestats_favorites_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success(`Exported ${favorites.length} favorites!`);
  };

  const exportHistory = () => {
    if (!history || history.length === 0) {
      toast.error('No history to export');
      return;
    }

    const exportData = {
      exported_at: new Date().toISOString(),
      total_scans: history.length,
      history: history.map(item => ({
        ip: item.ip,
        port: item.port,
        hostname: item.hostname,
        online: item.online,
        latency: item.latency,
        timestamp: item.timestamp
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cubestats_history_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success(`Exported ${history.length} scan records!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4"
      data-testid="bulk-export"
    >
      <h3 className="text-sm font-mono font-bold mb-3 text-primary">BULK EXPORT</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={exportFavorites}
          variant="outline"
          size="sm"
          data-testid="export-favorites-button"
          className="border-primary/30 hover:border-primary hover:bg-primary/10 font-mono flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          EXPORT FAVORITES
        </Button>
        <Button
          onClick={exportHistory}
          variant="outline"
          size="sm"
          data-testid="export-history-button"
          className="border-primary/30 hover:border-primary hover:bg-primary/10 font-mono flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          EXPORT HISTORY
        </Button>
      </div>
    </motion.div>
  );
};

export default BulkExport;