import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, Plus, X, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

const ServerCategories = ({ serverIp, serverPort }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const serverKey = `${serverIp}:${serverPort}`;

  useEffect(() => {
    // Load categories from localStorage
    const stored = localStorage.getItem(`categories_${serverKey}`);
    if (stored) {
      setCategories(JSON.parse(stored));
    }
  }, [serverKey]);

  const addCategory = () => {
    if (!newCategory.trim()) return;
    
    const updated = [...categories, newCategory.trim()];
    setCategories(updated);
    localStorage.setItem(`categories_${serverKey}`, JSON.stringify(updated));
    setNewCategory('');
    setIsAdding(false);
    toast.success('Category added');
  };

  const removeCategory = (index) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
    localStorage.setItem(`categories_${serverKey}`, JSON.stringify(updated));
    toast.success('Category removed');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6"
      data-testid="server-categories"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold font-mono">CATEGORIES</h3>
        </div>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          variant="ghost"
          size="sm"
          className="text-primary hover:bg-primary/10"
        >
          {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>

      {isAdding && (
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter category name..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            className="bg-white/5 border-white/10 focus:border-primary"
            data-testid="category-input"
          />
          <Button
            onClick={addCategory}
            className="bg-primary text-black hover:bg-primary/90 font-mono"
          >
            ADD
          </Button>
        </div>
      )}

      {categories.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <Badge
              key={index}
              variant="outline"
              className="border-primary/30 text-primary hover:border-primary bg-primary/10 px-3 py-1 font-mono"
            >
              {category}
              <button
                onClick={() => removeCategory(index)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          No categories yet. Add tags to organize this server.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground font-mono">Quick tags:</span>
        {['Survival', 'Creative', 'PvP', 'Skyblock', 'Minigames', 'Roleplay'].map(tag => (
          <button
            key={tag}
            onClick={() => {
              if (!categories.includes(tag)) {
                const updated = [...categories, tag];
                setCategories(updated);
                localStorage.setItem(`categories_${serverKey}`, JSON.stringify(updated));
                toast.success(`Added ${tag}`);
              }
            }}
            className="text-xs px-2 py-1 rounded border border-white/10 hover:border-primary/50 hover:bg-white/5 font-mono"
          >
            + {tag}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default ServerCategories;