import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const ServerSearchBar = ({ onScan, isLoading }) => {
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('25565');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ip.trim()) {
      onScan(ip.trim(), parseInt(port) || 25565);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto"
      data-testid="server-search-bar"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter server IP address..."
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              disabled={isLoading}
              data-testid="server-ip-input"
              className="bg-black/50 border-2 border-white/20 focus:border-primary text-xl p-6 w-full rounded-lg placeholder:text-white/30 font-mono h-16 focus-visible:ring-primary"
            />
          </div>
          <div className="w-full md:w-32">
            <Input
              type="text"
              placeholder="Port"
              value={port}
              onChange={(e) => setPort(e.target.value.replace(/[^0-9]/g, ''))}
              disabled={isLoading}
              data-testid="server-port-input"
              className="bg-black/50 border-2 border-white/20 focus:border-primary text-xl p-6 w-full rounded-lg placeholder:text-white/30 font-mono h-16 focus-visible:ring-primary"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !ip.trim()}
            data-testid="scan-button"
            className="bg-primary text-black font-bold hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(0,255,163,0.6)] px-8 h-16 text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-mono tracking-wider"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                SCANNING
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                SCAN
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ServerSearchBar;