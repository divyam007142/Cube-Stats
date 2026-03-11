import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Zap } from 'lucide-react';
import { Button } from './ui/button';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ServerComparison = ({ favorites, onSelectServer }) => {
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (favorites.length > 0) {
      loadComparisonData();
    }
  }, [favorites]);

  const loadComparisonData = async () => {
    setLoading(true);
    const data = [];
    
    for (const fav of favorites.slice(0, 5)) {
      try {
        const response = await axios.post(`${API}/server/scan`, {
          ip: fav.ip,
          port: fav.port
        });
        
        if (response.data.success && response.data.online) {
          data.push({
            ...fav,
            stats: response.data.data
          });
        }
      } catch (err) {
        console.error('Failed to load server:', err);
      }
    }
    
    setComparisonData(data);
    setLoading(false);
  };

  if (favorites.length === 0) {
    return (
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6" data-testid="comparison-panel">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold font-mono">SERVER COMPARISON</h3>
        </div>
        <div className="text-center text-muted-foreground py-8">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Add servers to favorites to compare them</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6" data-testid="comparison-panel">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold font-mono">SERVER COMPARISON</h3>
        </div>
        <Button
          onClick={loadComparisonData}
          variant="outline"
          size="sm"
          data-testid="refresh-comparison-button"
          className="border-primary/30 hover:border-primary hover:bg-primary/10 font-mono"
        >
          REFRESH
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading comparison data...</div>
      ) : (
        <div className="space-y-4">
          {comparisonData.map((server, index) => {
            const stats = server.stats;
            const playerPercentage = stats.players ? (stats.players.online / stats.players.max) * 100 : 0;
            
            return (
              <motion.button
                key={server.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelectServer(server.ip, server.port)}
                className="w-full bg-white/5 hover:bg-white/10 p-4 rounded border border-white/10 hover:border-primary/50 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-left">
                    <p className="font-mono text-sm font-semibold group-hover:text-primary">
                      {stats.hostname || server.ip}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {server.ip}:{server.port}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs text-primary font-mono">ONLINE</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="h-3 w-3 text-primary" />
                      <span className="text-xs text-muted-foreground font-mono">Players</span>
                    </div>
                    <p className="text-lg font-bold font-mono text-primary">
                      {stats.players?.online || 0}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="h-3 w-3 text-accent" />
                      <span className="text-xs text-muted-foreground font-mono">Capacity</span>
                    </div>
                    <p className="text-lg font-bold font-mono text-accent">
                      {playerPercentage.toFixed(0)}%
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Zap className="h-3 w-3 text-secondary" />
                      <span className="text-xs text-muted-foreground font-mono">Version</span>
                    </div>
                    <p className="text-xs font-mono text-secondary truncate">
                      {stats.version || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      style={{ width: `${playerPercentage}%` }}
                    />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServerComparison;