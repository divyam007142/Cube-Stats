import React from 'react';
import { motion } from 'framer-motion';
import { Server, Copy, Check } from 'lucide-react';
import { parseMotd } from '../utils/minecraftColors';
import { Button } from './ui/button';
import { toast } from 'sonner';

const ServerInfoCard = ({ serverData }) => {
  const [copied, setCopied] = React.useState(false);

  const copyServerAddress = () => {
    const address = `${serverData.ip}:${serverData.port}`;
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success('Server address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const motdElements = serverData?.motd?.clean ? parseMotd(serverData.motd.clean) : [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl hover:border-primary/50 p-6"
      data-testid="server-info-card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold font-mono tracking-tight">SERVER INFO</h3>
        <Server className="h-6 w-6 text-primary" />
      </div>

      <div className="space-y-4">
        {motdElements.length > 0 && (
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block uppercase tracking-wider">
              Message of the Day
            </label>
            <div className="bg-black/60 p-4 rounded-lg border border-white/10 font-mono text-sm leading-relaxed" data-testid="motd-display">
              {motdElements}
            </div>
          </div>
        )}

        {serverData?.map && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Map/World</span>
            <span className="font-mono text-sm">{serverData.map}</span>
          </div>
        )}

        {serverData?.gamemode && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Game Mode</span>
            <span className="font-mono text-sm capitalize">{serverData.gamemode}</span>
          </div>
        )}

        {serverData?.serverid && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Server ID</span>
            <span className="font-mono text-xs truncate max-w-[200px]">{serverData.serverid}</span>
          </div>
        )}

        <div className="pt-4">
          <Button
            onClick={copyServerAddress}
            variant="outline"
            data-testid="copy-address-button"
            className="w-full border-primary/30 hover:border-primary hover:bg-primary/10 font-mono"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-primary" />
                COPIED!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                COPY SERVER ADDRESS
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServerInfoCard;