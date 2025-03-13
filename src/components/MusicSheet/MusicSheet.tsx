import { useRef, useEffect } from 'react';
import Note from './Note';
import type { MusicNote } from '@/utils/musicUtils';

interface MusicSheetProps {
  notes: MusicNote[];
  currentNoteIndex: number;
}

const MusicSheet = ({ notes, currentNoteIndex }: MusicSheetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to keep current note visible
  useEffect(() => {
    if (containerRef.current && notes[currentNoteIndex]) {
      const noteElements = containerRef.current.children;
      if (noteElements[currentNoteIndex]) {
        const noteElement = noteElements[currentNoteIndex] as HTMLElement;
        
        const containerWidth = containerRef.current.offsetWidth;
        const noteLeft = noteElement.offsetLeft;
        const noteWidth = noteElement.offsetWidth;
        
        // Center the current note if possible
        containerRef.current.scrollLeft = noteLeft - containerWidth / 2 + noteWidth / 2;
      }
    }
  }, [currentNoteIndex, notes]);
  
  return (
    <div className="music-sheet">
      <div 
        ref={containerRef}
        className="flex w-full gap-4 overflow-x-auto px-4 py-2 scrollbar-hide transition-all duration-300 ease-in-out"
      >
        {notes.map((note, index) => (
          <Note
            key={note.id}
            note={note}
            isActive={index === currentNoteIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default MusicSheet;
