import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Wifi, WifiOff, Zap, TrendingUp } from 'lucide-react';

const StatusCard = ({ serverData, latency, uptime }) => {
  const isOnline = serverData?.online;

  const getLatencyColor = (ms) => {
    if (ms < 100) return 'text-primary';
    if (ms < 200) return 'text-accent';
    if (ms < 500) return 'text-yellow-400';
    return 'text-destructive';
  };

  const getLatencyStatus = (ms) => {
    if (ms < 100) return 'Excellent';
    if (ms < 200) return 'Good';
    if (ms < 500) return 'Fair';
    return 'Poor';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl hover:border-primary/50 p-6"
      data-testid="status-card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold font-mono tracking-tight">SERVER STATUS</h3>
        {isOnline ? (
          <Wifi className="h-6 w-6 text-primary" />
        ) : (
          <WifiOff className="h-6 w-6 text-destructive" />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Status</span>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: isOnline ? [1, 1.2, 1] : 1,
                opacity: isOnline ? [0.5, 1, 0.5] : 0.5,
              }}
              transition={{
                duration: 2,
                repeat: isOnline ? Infinity : 0,
                ease: "easeInOut",
              }}
              className={`h-3 w-3 rounded-full ${
                isOnline ? 'bg-primary shadow-[0_0_10px_rgba(0,255,163,0.8)]' : 'bg-destructive'
              }`}
              data-testid="status-indicator"
            />
            <span
              className={`font-bold font-mono ${
                isOnline ? 'text-primary' : 'text-destructive'
              }`}
            >
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {latency !== null && latency !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Latency
            </span>
            <div className="text-right">
              <span className={`font-bold font-mono text-lg ${getLatencyColor(latency)}`}>
                {Math.round(latency)}ms
              </span>
              <p className={`text-xs ${getLatencyColor(latency)}`}>
                {getLatencyStatus(latency)}
              </p>
            </div>
          </div>
        )}

        {uptime && uptime.uptime_percentage !== null && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Uptime (30d)
            </span>
            <div className="text-right">
              <span className="font-bold font-mono text-lg text-primary">
                {uptime.uptime_percentage}%
              </span>
              <p className="text-xs text-muted-foreground">
                {uptime.successful_scans}/{uptime.total_scans} scans
              </p>
            </div>
          </div>
        )}

        {isOnline && serverData.ip && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">IP Address</span>
            <span className="font-mono text-sm">{serverData.ip}:{serverData.port}</span>
          </div>
        )}

        {isOnline && serverData.hostname && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Hostname</span>
            <span className="font-mono text-sm">{serverData.hostname}</span>
          </div>
        )}

        {isOnline && serverData.version && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Version</span>
            <span className="font-mono text-sm">{serverData.version}</span>
          </div>
        )}

        {isOnline && serverData.protocol !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Protocol</span>
            <span className="font-mono text-sm">{serverData.protocol}</span>
          </div>
        )}

        {isOnline && serverData.software && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Software</span>
            <span className="font-mono text-sm">{serverData.software}</span>
          </div>
        )}
      </div>

      {serverData.icon && (
        <div className="mt-6 flex justify-center">
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            src={serverData.icon}
            alt="Server Icon"
            className="w-16 h-16 rounded-lg border-2 border-primary/30"
            data-testid="server-icon"
          />
        </div>
      )}
    </motion.div>
  );
};

export default StatusCard;