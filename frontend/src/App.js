import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, History as HistoryIcon, Github, RefreshCw, Download, Share2, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import '@/index.css';
import '@/App.css';

import ServerSearchBar from './components/ServerSearchBar';
import StatusCard from './components/StatusCard';
import PlayersCard from './components/PlayersCard';
import ServerInfoCard from './components/ServerInfoCard';
import PluginsCard from './components/PluginsCard';
import RawJsonViewer from './components/RawJsonViewer';
import HistoryPanel from './components/HistoryPanel';
import FavoritesPanel from './components/FavoritesPanel';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorDisplay from './components/ErrorDisplay';
import ServerComparison from './components/ServerComparison';
import ServerNotes from './components/ServerNotes';
import { Button } from './components/ui/button';
import { Switch } from './components/ui/switch';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [loading, setLoading] = useState(false);
  const [serverData, setServerData] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentServer, setCurrentServer] = useState({ ip: '', port: 25565 });

  useEffect(() => {
    fetchHistory();
    fetchFavorites();
  }, []);

  // Auto-refresh logic
  useEffect(() => {
    let interval;
    if (autoRefresh && currentServer.ip && serverData) {
      interval = setInterval(() => {
        refreshCurrentServer();
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, currentServer, serverData]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API}/server/history`);
      setHistory(response.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API}/favorites`);
      setFavorites(response.data);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  };

  const scanServer = async (ip, port) => {
    setLoading(true);
    setError(null);
    setServerData(null);
    setShowHistory(false);
    setShowFavorites(false);
    setShowComparison(false);
    setCurrentServer({ ip, port });

    try {
      const response = await axios.post(`${API}/server/scan`, { ip, port });

      if (response.data.success && response.data.online) {
        setServerData(response.data.data);
        setLastUpdated(new Date());
        toast.success('Server scan completed!');
        fetchHistory();
        checkIfFavorited(ip, port);
      } else {
        setError('Server is offline or does not exist');
        toast.error('Server is offline');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to scan server';
      setError(errorMsg);
      toast.error('Scan failed');
    } finally {
      setLoading(false);
    }
  };

  const refreshCurrentServer = async () => {
    if (!currentServer.ip) return;
    
    try {
      const response = await axios.post(`${API}/server/scan`, { 
        ip: currentServer.ip, 
        port: currentServer.port 
      });

      if (response.data.success && response.data.online) {
        setServerData(response.data.data);
        setLastUpdated(new Date());
        toast.success('Stats refreshed!');
      }
    } catch (err) {
      toast.error('Failed to refresh stats');
    }
  };

  const checkIfFavorited = (ip, port) => {
    const found = favorites.some(fav => fav.ip === ip && fav.port === port);
    setIsFavorited(found);
  };

  const toggleFavorite = async () => {
    if (!serverData) return;

    const ip = serverData.ip;
    const port = serverData.port;

    if (isFavorited) {
      const favorite = favorites.find(fav => fav.ip === ip && fav.port === port);
      if (favorite) {
        try {
          await axios.delete(`${API}/favorites/remove/${favorite.id}`);
          toast.success('Removed from favorites');
          fetchFavorites();
          setIsFavorited(false);
        } catch (err) {
          toast.error('Failed to remove favorite');
        }
      }
    } else {
      try {
        await axios.post(`${API}/favorites/add`, { ip, port });
        toast.success('Added to favorites!');
        fetchFavorites();
        setIsFavorited(true);
      } catch (err) {
        toast.error('Failed to add favorite');
      }
    }
  };

  const removeFavorite = async (id) => {
    try {
      await axios.delete(`${API}/favorites/remove/${id}`);
      toast.success('Removed from favorites');
      fetchFavorites();
      if (serverData) {
        checkIfFavorited(serverData.ip, serverData.port);
      }
    } catch (err) {
      toast.error('Failed to remove favorite');
    }
  };

  const clearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      toast.info('History cleared');
      setHistory([]);
    }
  };

  const shareServer = () => {
    if (!serverData) return;
    const url = `${window.location.origin}?server=${serverData.ip}:${serverData.port}`;
    navigator.clipboard.writeText(url);
    toast.success('Share link copied to clipboard!');
  };

  const exportServerData = () => {
    if (!serverData) return;
    const dataStr = JSON.stringify(serverData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${serverData.hostname || serverData.ip}_data.json`;
    link.click();
    toast.success('Server data exported!');
  };

  const getTimeSinceUpdate = () => {
    if (!lastUpdated) return '';
    const seconds = Math.floor((new Date() - lastUpdated) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden" data-testid="main-app">
      <Toaster position="top-right" theme="dark" richColors />
      
      {/* Background Pattern */}
      <div className="fixed inset-0 grid-pattern opacity-20" />
      
      {/* Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-float" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1s' }} />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-black/40" data-testid="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <img 
                src="https://customer-assets.emergentagent.com/job_server-scanner-3/artifacts/o9g0ldxd_cubestats_logo-removebg-preview.png" 
                alt="CubeStats Logo" 
                className="h-10 w-10"
              />
              <h1 className="text-3xl font-bold font-mono tracking-tighter text-glow">CUBESTATS</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Button
                variant="outline"
                onClick={() => {
                  setShowComparison(!showComparison);
                  setShowHistory(false);
                  setShowFavorites(false);
                }}
                data-testid="comparison-toggle-button"
                className="border-primary/30 hover:border-primary hover:bg-primary/10"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Compare
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowHistory(!showHistory);
                  setShowFavorites(false);
                  setShowComparison(false);
                }}
                data-testid="history-toggle-button"
                className="border-primary/30 hover:border-primary hover:bg-primary/10"
              >
                <HistoryIcon className="h-4 w-4 mr-2" />
                History
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowFavorites(!showFavorites);
                  setShowHistory(false);
                  setShowComparison(false);
                }}
                data-testid="favorites-toggle-button"
                className="border-primary/30 hover:border-primary hover:bg-primary/10"
              >
                <Star className="h-4 w-4 mr-2" />
                Favorites
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold font-mono mb-4 tracking-tighter">
            Scan Minecraft Servers
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Get detailed information about any Minecraft server
          </p>
          <ServerSearchBar onScan={scanServer} isLoading={loading} />
        </motion.div>

        {/* Side Panels */}
        {(showHistory || showFavorites || showComparison) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {showHistory && (
              <HistoryPanel
                history={history}
                onSelectServer={scanServer}
                onClearHistory={clearHistory}
              />
            )}
            {showFavorites && (
              <FavoritesPanel
                favorites={favorites}
                onSelectServer={scanServer}
                onRemoveFavorite={removeFavorite}
              />
            )}
            {showComparison && (
              <ServerComparison
                favorites={favorites}
                onSelectServer={scanServer}
              />
            )}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Error State */}
        {error && !loading && (
          <ErrorDisplay error={error} onRetry={() => setError(null)} />
        )}

        {/* Server Data */}
        {serverData && !loading && !error && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button
                  onClick={toggleFavorite}
                  variant={isFavorited ? 'default' : 'outline'}
                  data-testid="favorite-toggle-button"
                  className={isFavorited 
                    ? 'bg-primary text-black hover:bg-primary/90 font-mono' 
                    : 'border-primary/30 hover:border-primary hover:bg-primary/10 font-mono'
                  }
                >
                  <Star className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                  {isFavorited ? 'FAVORITED' : 'ADD TO FAVORITES'}
                </Button>
                
                <Button
                  onClick={refreshCurrentServer}
                  variant="outline"
                  data-testid="refresh-button"
                  className="border-primary/30 hover:border-primary hover:bg-primary/10 font-mono"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  REFRESH
                </Button>

                <Button
                  onClick={shareServer}
                  variant="outline"
                  data-testid="share-button"
                  className="border-primary/30 hover:border-primary hover:bg-primary/10 font-mono"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  SHARE
                </Button>

                <Button
                  onClick={exportServerData}
                  variant="outline"
                  data-testid="export-button"
                  className="border-primary/30 hover:border-primary hover:bg-primary/10 font-mono"
                >
                  <Download className="h-4 w-4 mr-2" />
                  EXPORT
                </Button>
              </div>

              <div className="flex items-center gap-3">
                {lastUpdated && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                    <Clock className="h-4 w-4" />
                    <span>Updated {getTimeSinceUpdate()}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground font-mono">Auto-refresh</span>
                  <Switch
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                    data-testid="auto-refresh-toggle"
                  />
                </div>
              </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <StatusCard serverData={serverData} />
              </div>
              <div className="lg:col-span-1">
                <PlayersCard serverData={serverData} />
              </div>
              <div className="lg:col-span-1">
                <ServerInfoCard serverData={serverData} />
              </div>
              <div className="lg:col-span-2">
                <PluginsCard serverData={serverData} />
              </div>
              <div className="lg:col-span-1">
                <ServerNotes serverId={`${serverData.ip}:${serverData.port}`} />
              </div>
            </div>

            {/* Raw JSON Viewer */}
            <RawJsonViewer data={serverData} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-xl bg-black/40 mt-20" data-testid="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm font-mono">
              © 2026 Cube Stats. Made with ♡ by Lunar Vibes
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;