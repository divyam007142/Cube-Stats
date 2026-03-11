import React from 'react';
import { motion } from 'framer-motion';
import { Users, User } from 'lucide-react';

const PlayersCard = ({ serverData }) => {
  const players = serverData?.players || {};
  const onlinePlayers = players.online || 0;
  const maxPlayers = players.max || 0;
  const playerList = players.list || [];

  return (
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
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/10"
                  data-testid={`player-${index}`}
                >
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-mono text-sm truncate">{player}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {onlinePlayers > 0 && playerList.length === 0 && (
          <div className="mt-4 text-center text-muted-foreground text-sm py-4">
            <p>Player names not visible on this server</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PlayersCard;