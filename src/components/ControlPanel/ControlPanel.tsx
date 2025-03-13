
import { useState, useEffect } from 'react';
import { calculateAccuracy, getAccuracyRating, getAccuracyClass } from '@/utils/musicUtils';
import type { MusicNote } from '@/utils/musicUtils';

interface ControlPanelProps {
  musicSheet: MusicNote[];
  isPlaying: boolean;
  isCompleted: boolean;
  onGenerate: () => void;
  onRetry: () => void;
  onPlayPause: () => void;
}

const ControlPanel = ({
  musicSheet,
  isPlaying,
  isCompleted,
  onGenerate,
  onRetry,
  onPlayPause,
}: ControlPanelProps) => {
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  
  useEffect(() => {
    if (isCompleted && musicSheet.length > 0) {
      setAccuracy(calculateAccuracy(musicSheet));
    } else {
      setAccuracy(null);
    }
  }, [isCompleted, musicSheet]);
  
  return (
    <div className="control-panel glass-panel">
      <div className="mb-4 flex items-center justify-center">
        <h2 className="text-2xl font-light tracking-tight text-gray-900">
          Piano Tutor
        </h2>
      </div>

      {accuracy !== null && (
        <div className="mb-4 text-center animate-fade-in">
          <div className="mb-2 text-lg font-medium">
            {getAccuracyRating(accuracy)}
          </div>
          <div className={`accuracy-badge ${getAccuracyClass(accuracy)}`}>
            {accuracy}% Accuracy
          </div>
        </div>
      )}

      <div className="flex w-full flex-wrap gap-2">
        <button
          className="button-primary flex-1"
          onClick={onGenerate}
        >
          New Sheet
        </button>
        
        <button
          className="button-secondary flex-1"
          onClick={onRetry}
          disabled={musicSheet.length === 0}
        >
          Retry
        </button>
        
        <button
          className={`button-primary flex-1 ${
            isPlaying ? 'bg-piano-incorrect' : ''
          }`}
          onClick={onPlayPause}
          disabled={musicSheet.length === 0 || isCompleted}
        >
          {isPlaying ? 'Stop' : 'Play (Spacebar)'}
        </button>
      </div>
      
      <div className="mt-4 w-full">
        <button
          className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setShowHelp(!showHelp)}
        >
          {showHelp ? 'Hide Help' : 'Show Help'}
        </button>
        
        {showHelp && (
          <div className="mt-2 rounded-md bg-secondary p-2 text-xs text-secondary-foreground animate-fade-in">
            <p className="mb-1"><strong>White Keys:</strong> A, S, D, F, G, H, J, K, L, ;, '</p>
            <p><strong>Black Keys:</strong> W, E, T, Y, U, O, P, ]</p>
            <p className="mt-1"><strong>Spacebar:</strong> Play/Stop the music</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
