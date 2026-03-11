import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, ExternalLink, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

const PlayersCard = ({ serverData }) => {
  const players = serverData?.players || {};
  const onlinePlayers = players.online || 0;
  const maxPlayers = players.max || 0;
  const playerList = players.list || [];
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchPlayerStats = async (playerName) => {
    setLoadingStats(true);
    setSelectedPlayer(playerName);
    
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const API = `${BACKEND_URL}/api`;
      
      // Fetch player data from our backend
      const response = await fetch(`${API}/player/${encodeURIComponent(playerName)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setPlayerStats({ error: 'Player not found' });
        } else {
          setPlayerStats({ error: 'Failed to load player data' });
        }
        setLoadingStats(false);
        return;
      }
      
      const data = await response.json();
      
      setPlayerStats({
        name: data.name,
        uuid: data.uuid,
        uuid_raw: data.uuid_raw,
        skin: data.skin,
        head: data.head,
        legacy: data.legacy || false
      });
    } catch (error) {
      console.error('Error fetching player stats:', error);
      setPlayerStats({ error: 'Failed to load player data' });
    } finally {
      setLoadingStats(false);
    }
  };

  const closeDialog = () => {
    setSelectedPlayer(null);
    setPlayerStats(null);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl hover:border-primary/50 p-6"
        data-testid="players-card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold font-mono tracking-tight">PLAYERS</h3>
          <Users className="h-6 w-6 text-primary" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Online</span>
            <span className="font-bold font-mono text-2xl text-primary" data-testid="online-players-count">
              {onlinePlayers}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Maximum</span>
            <span className="font-mono text-xl" data-testid="max-players-count">{maxPlayers}</span>
          </div>

          <div className="relative pt-2">
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${maxPlayers > 0 ? (onlinePlayers / maxPlayers) * 100 : 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              />
            </div>
          </div>

          {playerList.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-mono text-muted-foreground mb-3 uppercase tracking-wider">
                Connected Players
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto scrollbar-custom" data-testid="player-list">
                {playerList.map((player, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => fetchPlayerStats(player)}
                    className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/10 hover:border-primary/50 hover:bg-white/10 cursor-pointer group"
                    data-testid={`player-${index}`}
                  >
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-mono text-sm truncate flex-1 text-left group-hover:text-primary">{player}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {onlinePlayers > 0 && playerList.length === 0 && (
            <div className="mt-4 text-center text-muted-foreground text-sm">
              <p>Player names not visible</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Player Stats Dialog */}
      <Dialog open={!!selectedPlayer} onOpenChange={closeDialog}>
        <DialogContent className="bg-black/95 backdrop-blur-xl border-primary/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-mono flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              Player Statistics
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {loadingStats ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : playerStats?.error ? (
              <div className="text-center py-12">
                <p className="text-destructive text-lg mb-2">{playerStats.error}</p>
                <p className="text-muted-foreground text-sm">Unable to fetch player data from Mojang API</p>
              </div>
            ) : playerStats ? (
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={playerStats.skin}
                      alt={playerStats.name}
                      className="w-32 h-32 rounded-lg border-2 border-primary/30"
                      onError={(e) => {
                        e.target.src = playerStats.head;
                        e.target.className = 'w-32 h-32 rounded-lg border-2 border-primary/30 object-cover';
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground font-mono">USERNAME</label>
                      <p className="text-2xl font-bold font-mono text-primary">{playerStats.name}</p>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground font-mono">UUID</label>
                      <p className="text-sm font-mono bg-white/5 p-2 rounded border border-white/10">
                        {playerStats.uuid}
                      </p>
                    </div>

                    {playerStats.legacy && (
                      <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-3 py-1 rounded-full text-xs font-mono">
                        LEGACY ACCOUNT
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <a
                    href={`https://namemc.com/profile/${playerStats.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 p-3 rounded-lg font-mono text-sm transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    NameMC Profile
                  </a>
                  <a
                    href={`https://mine.ly/${playerStats.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 p-3 rounded-lg font-mono text-sm transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Mine.ly Profile
                  </a>
                </div>

                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h4 className="text-sm font-mono text-muted-foreground mb-3">SKIN DOWNLOADS</h4>
                  <div className="flex gap-2">
                    <a
                      href={`https://crafatar.com/skins/${playerStats.uuid_raw || playerStats.uuid.replace(/-/g, '')}`}
                      download
                      className="flex-1 text-center bg-primary/10 hover:bg-primary/20 border border-primary/30 p-2 rounded font-mono text-xs transition-colors"
                    >
                      Download Skin
                    </a>
                    <a
                      href={`https://crafatar.com/capes/${playerStats.uuid_raw || playerStats.uuid.replace(/-/g, '')}`}
                      download
                      className="flex-1 text-center bg-primary/10 hover:bg-primary/20 border border-primary/30 p-2 rounded font-mono text-xs transition-colors"
                    >
                      Download Cape
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={closeDialog}
              className="bg-primary text-black hover:bg-primary/90 font-mono"
            >
              CLOSE
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlayersCard;