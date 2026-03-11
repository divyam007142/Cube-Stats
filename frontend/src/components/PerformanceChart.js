import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Zap, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const PerformanceChart = ({ serverIp, serverPort }) => {
  const [performanceData, setPerformanceData] = useState([]);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    // Load performance data from localStorage
    const key = `performance_${serverIp}_${serverPort}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setPerformanceData(JSON.parse(stored));
    }
  }, [serverIp, serverPort]);

  const saveDataPoint = (latency, players) => {
    const key = `performance_${serverIp}_${serverPort}`;
    const newPoint = {
      timestamp: new Date().toISOString(),
      latency: latency,
      players: players,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...performanceData, newPoint].slice(-50); // Keep last 50 data points
    setPerformanceData(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  // Expose function to parent
  React.useEffect(() => {
    if (window.savePerformanceData) return;
    window.savePerformanceData = saveDataPoint;
  }, [performanceData]);

  if (performanceData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6"
        data-testid="performance-chart"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold font-mono">PERFORMANCE ANALYTICS</h3>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Scan the server multiple times to build performance history</p>
        </div>
      </motion.div>
    );
  }

  const avgLatency = performanceData.reduce((acc, d) => acc + d.latency, 0) / performanceData.length;
  const avgPlayers = performanceData.reduce((acc, d) => acc + d.players, 0) / performanceData.length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6"
      data-testid="performance-chart"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold font-mono">PERFORMANCE ANALYTICS</h3>
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {performanceData.length} data points
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 p-3 rounded border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground font-mono">AVG LATENCY</span>
          </div>
          <p className="text-2xl font-bold font-mono text-primary">{avgLatency.toFixed(0)}ms</p>
        </div>
        <div className="bg-white/5 p-3 rounded border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="text-xs text-muted-foreground font-mono">AVG PLAYERS</span>
          </div>
          <p className="text-2xl font-bold font-mono text-accent">{avgPlayers.toFixed(0)}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-mono text-muted-foreground mb-3">Latency Over Time</h4>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffa3" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ffa3" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#888" style={{ fontSize: '10px' }} />
              <YAxis stroke="#888" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #00ffa3', borderRadius: '8px' }}
                labelStyle={{ color: '#00ffa3' }}
              />
              <Area type="monotone" dataKey="latency" stroke="#00ffa3" fill="url(#latencyGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-sm font-mono text-muted-foreground mb-3">Player Count Over Time</h4>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#888" style={{ fontSize: '10px' }} />
              <YAxis stroke="#888" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #00d4ff', borderRadius: '8px' }}
                labelStyle={{ color: '#00d4ff' }}
              />
              <Line type="monotone" dataKey="players" stroke="#00d4ff" strokeWidth={2} dot={{ fill: '#00d4ff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default PerformanceChart;