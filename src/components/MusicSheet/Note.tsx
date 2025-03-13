
import { useEffect, useState } from 'react';
import { noteToKey } from '@/utils/audioUtils';
import type { MusicNote } from '@/utils/musicUtils';

interface NoteProps {
  note: MusicNote;
  isActive: boolean;
}

const Note = ({ note, isActive }: NoteProps) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      setAnimate(true);
    }
  }, [isActive]);
  
  const getStatusClass = () => {
    switch (note.status) {
      case 'current':
        return 'bg-primary text-white animate-pulse-gentle';
      case 'correct':
        return 'bg-piano-correct text-white';
      case 'incorrect':
        return 'bg-piano-incorrect text-white';
      case 'missed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };
  
  const getNoteLabel = () => {
    const baseNote = note.note.substring(0, note.note.length - 1);
    const octave = note.note.substring(note.note.length - 1);
    return (
      <>
        <span className="text-lg font-semibold">{baseNote}</span>
        <span className="text-xs">{octave}</span>
      </>
    );
  };
  
  const getKeyLabel = () => {
    const key = noteToKey[note.note];
    return key ? key.toUpperCase() : '';
  };
  
  return (
    <div
      className={`music-note ${getStatusClass()} ${
        animate ? 'animate-scale-in' : ''
      }`}
    >
      <div className="flex flex-col items-center">
        {getNoteLabel()}
        <span className="mt-1 text-xs">{getKeyLabel()}</span>
      </div>
    </div>
  );
};

export default Note;
