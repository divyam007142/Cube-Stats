import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Save, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

const ServerNotes = ({ serverId }) => {
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [savedNotes, setSavedNotes] = useState('');

  useEffect(() => {
    // Load notes from localStorage
    const stored = localStorage.getItem(`server_notes_${serverId}`);
    if (stored) {
      setNotes(stored);
      setSavedNotes(stored);
    }
  }, [serverId]);

  const saveNotes = () => {
    localStorage.setItem(`server_notes_${serverId}`, notes);
    setSavedNotes(notes);
    setIsEditing(false);
    toast.success('Notes saved!');
  };

  const hasChanges = notes !== savedNotes;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl hover:border-primary/50 p-6 h-full"
      data-testid="server-notes"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold font-mono tracking-tight">NOTES</h3>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="ghost"
          size="sm"
          data-testid="edit-notes-button"
          className="text-primary hover:text-primary hover:bg-primary/10"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this server..."
            className="bg-black/60 border-white/10 focus:border-primary min-h-[200px] font-mono text-sm resize-none"
            data-testid="notes-textarea"
          />
          <div className="flex gap-2">
            <Button
              onClick={saveNotes}
              disabled={!hasChanges}
              data-testid="save-notes-button"
              className="bg-primary text-black hover:bg-primary/90 font-mono"
            >
              <Save className="h-4 w-4 mr-2" />
              SAVE
            </Button>
            <Button
              onClick={() => {
                setNotes(savedNotes);
                setIsEditing(false);
              }}
              variant="outline"
              className="border-primary/30 hover:border-primary hover:bg-primary/10 font-mono"
            >
              CANCEL
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-black/60 p-4 rounded-lg border border-white/10 min-h-[200px]">
          {savedNotes ? (
            <p className="text-sm font-mono whitespace-pre-wrap text-muted-foreground">
              {savedNotes}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No notes yet. Click edit to add notes.
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ServerNotes;