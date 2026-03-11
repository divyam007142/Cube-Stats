import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, UserPlus, UserMinus, Clock, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

const PlayerActivityLog = ({ serverIp, serverPort, currentPlayers }) => {
  const [activityLog, setActivityLog] = useState([]);
  const [playerSessions, setPlayerSessions] = useState({});
  const serverKey = `${serverIp}:${serverPort}`;

  useEffect(() => {
    // Load activity log from localStorage
    const storedLog = localStorage.getItem(`activity_log_${serverKey}`);
    const storedSessions = localStorage.getItem(`player_sessions_${serverKey}`);
    
    if (storedLog) {
      setActivityLog(JSON.parse(storedLog));
    }
    if (storedSessions) {
      setPlayerSessions(JSON.parse(storedSessions));
    }
  }, [serverKey]);

  useEffect(() => {
    if (!currentPlayers || currentPlayers.length === 0) return;

    const now = new Date().toISOString();
    const currentPlayerSet = new Set(currentPlayers);
    const previousPlayerSet = new Set(Object.keys(playerSessions));

    // Find players who joined
    const joined = currentPlayers.filter(p => !previousPlayerSet.has(p));
    
    // Find players who left
    const left = Array.from(previousPlayerSet).filter(p => !currentPlayerSet.has(p));

    const newLogs = [];
    const updatedSessions = { ...playerSessions };

    // Handle joins
    joined.forEach(player => {
      newLogs.push({
        id: `${Date.now()}_${player}`,
        type: 'join',
        player: player,
        timestamp: now,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      updatedSessions[player] = { joinedAt: now };
    });

    // Handle leaves
    left.forEach(player => {
      const session = playerSessions[player];
      if (session) {
        const joinTime = new Date(session.joinedAt);
        const leaveTime = new Date(now);
        const playTimeMs = leaveTime - joinTime;
        const playTimeMinutes = Math.floor(playTimeMs / 60000);
        const playTimeHours = Math.floor(playTimeMinutes / 60);
        const remainingMinutes = playTimeMinutes % 60;

        let playTimeStr = '';
        if (playTimeHours > 0) {
          playTimeStr = `${playTimeHours}h ${remainingMinutes}m`;
        } else if (playTimeMinutes > 0) {
          playTimeStr = `${playTimeMinutes}m`;
        } else {
          playTimeStr = 'less than 1m';
        }

        newLogs.push({
          id: `${Date.now()}_${player}_leave`,
          type: 'leave',
          player: player,
          timestamp: now,
          playTime: playTimeStr,
          playTimeMs: playTimeMs,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        delete updatedSessions[player];
      }
    });

    if (newLogs.length > 0) {
      const updatedLog = [...newLogs, ...activityLog].slice(0, 100); // Keep last 100 entries
      setActivityLog(updatedLog);
      localStorage.setItem(`activity_log_${serverKey}`, JSON.stringify(updatedLog));
    }

    setPlayerSessions(updatedSessions);
    localStorage.setItem(`player_sessions_${serverKey}`, JSON.stringify(updatedSessions));
  }, [currentPlayers]);

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now - then) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const clearLog = () => {
    if (window.confirm('Clear all activity logs?')) {
      setActivityLog([]);
      localStorage.removeItem(`activity_log_${serverKey}`);
    }
  };

  const getOnlineTime = (player) => {
    if (!playerSessions[player]) return null;
    const joinTime = new Date(playerSessions[player].joinedAt);
    const now = new Date();
    const playTimeMs = now - joinTime;
    const minutes = Math.floor(playTimeMs / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    }
    return 'less than 1m';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6"
      data-testid="player-activity-log"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold font-mono">ACTIVITY LOG</h3>
        </div>
        {activityLog.length > 0 && (
          <Button
            onClick={clearLog}
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Currently Online Players */}
      {Object.keys(playerSessions).length > 0 && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
          <h4 className="text-xs font-mono text-primary mb-2 uppercase tracking-wider">Currently Playing</h4>
          <div className="space-y-1">
            {Object.keys(playerSessions).map((player, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="font-mono flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  {player}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {getOnlineTime(player)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Feed */}
      {activityLog.length > 0 ? (
        <ScrollArea className="h-[300px]" data-testid="activity-feed">
          <div className="space-y-2">
            {activityLog.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`p-3 rounded-lg border ${
                  log.type === 'join' 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-destructive/5 border-destructive/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${
                    log.type === 'join' ? 'text-primary' : 'text-destructive'
                  }`}>
                    {log.type === 'join' ? (
                      <UserPlus className="h-4 w-4" />
                    ) : (
                      <UserMinus className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm font-semibold">{log.player}</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {getTimeAgo(log.timestamp)}
                      </span>
                    </div>
                    {log.type === 'join' ? (
                      <p className="text-xs text-muted-foreground font-mono">
                        joined the server
                      </p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground font-mono">
                          left the server
                        </p>
                        {log.playTime && (
                          <Badge variant="outline" className="text-xs border-accent/30 text-accent font-mono">
                            <Clock className="h-3 w-3 mr-1" />
                            played {log.playTime}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No activity recorded yet</p>
          <p className="text-xs mt-2">Scan the server multiple times to track player activity</p>
        </div>
      )}

      {activityLog.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>Total events: {activityLog.length}</span>
            <span>Updates on each scan</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PlayerActivityLog;