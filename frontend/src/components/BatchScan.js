import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';

const BatchScan = ({ onResults }) => {
  const [serverList, setServerList] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [showInput, setShowInput] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  const startBatchScan = async () => {
    const servers = serverList
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));

    if (servers.length === 0) {
      toast.error('Please enter at least one server');
      return;
    }

    if (servers.length > 20) {
      toast.error('Maximum 20 servers at once');
      return;
    }

    setIsScanning(true);
    setProgress({ current: 0, total: servers.length });
    const results = [];

    for (let i = 0; i < servers.length; i++) {
      const server = servers[i];
      const [ip, port = '25565'] = server.split(':');

      try {
        const response = await axios.post(`${API}/server/scan`, {
          ip,
          port: parseInt(port)
        });

        results.push({
          ip,
          port: parseInt(port),
          success: response.data.success,
          online: response.data.online,
          data: response.data.data,
          latency: response.data.latency
        });

        setProgress({ current: i + 1, total: servers.length });
      } catch (error) {
        results.push({
          ip,
          port: parseInt(port),
          success: false,
          online: false,
          error: error.message
        });
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsScanning(false);
    onResults(results);
    toast.success(`Scanned ${results.length} servers`);
    setServerList('');
    setShowInput(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6"
      data-testid="batch-scan"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold font-mono">BATCH SCAN</h3>
        </div>
        <Button
          onClick={() => setShowInput(!showInput)}
          variant="outline"
          size="sm"
          className="border-primary/30 hover:border-primary hover:bg-primary/10"
        >
          {showInput ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>

      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <Textarea
              placeholder="Enter servers (one per line):\nmc.hypixel.net:25565\nplay.example.com\n# Comments start with #"
              value={serverList}
              onChange={(e) => setServerList(e.target.value)}
              disabled={isScanning}
              className="bg-white/5 border-white/10 focus:border-primary min-h-[150px] font-mono text-sm"
              data-testid="batch-scan-input"
            />

            {isScanning && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-mono">
                  <span className="text-muted-foreground">Scanning...</span>
                  <span className="text-primary">{progress.current} / {progress.total}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={startBatchScan}
                disabled={isScanning || !serverList.trim()}
                className="flex-1 bg-primary text-black hover:bg-primary/90 font-mono"
                data-testid="start-batch-scan"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    SCANNING
                  </>
                ) : (
                  <>
                    <Layers className="mr-2 h-4 w-4" />
                    SCAN ALL
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  setServerList('');
                  setShowInput(false);
                }}
                variant="outline"
                disabled={isScanning}
                className="border-primary/30 hover:border-primary hover:bg-primary/10 font-mono"
              >
                CANCEL
              </Button>
            </div>

            <p className="text-xs text-muted-foreground font-mono">
              💡 Tip: Maximum 20 servers. Format: ip:port (port defaults to 25565)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BatchScan;