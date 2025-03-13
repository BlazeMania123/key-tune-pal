import { useState, useEffect, useCallback } from 'react';
import PianoKeyboard from '@/components/Piano/PianoKeyboard';
import MusicSheet from '@/components/MusicSheet/MusicSheet';
import ControlPanel from '@/components/ControlPanel/ControlPanel';
import { 
  initializeAudio, 
  playNote, 
  playNoteSequence, 
  stopAllSounds,
  keyMap
} from '@/utils/audioUtils';
import { 
  generateRandomMusicSheet, 
  type MusicNote 
} from '@/utils/musicUtils';

const Index = () => {
  const [musicSheet, setMusicSheet] = useState<MusicNote[]>([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  // Initialize audio
  useEffect(() => {
    const init = async () => {
      await initializeAudio();
      setIsAudioInitialized(true);
    };
    
    init();
    
    return () => {
      stopAllSounds();
    };
  }, []);

  // Handle spacebar to play/pause
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.repeat) {
        event.preventDefault();
        handlePlayPause();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPlaying, musicSheet]);

  // Generate new music sheet
  const handleGenerateSheet = useCallback(() => {
    const newSheet = generateRandomMusicSheet(8);
    setMusicSheet(newSheet);
    setCurrentNoteIndex(0);
    setIsPlaying(false);
    setIsCompleted(false);
    stopAllSounds();
  }, []);

  // Retry current sheet
  const handleRetry = useCallback(() => {
    if (musicSheet.length > 0) {
      const resetSheet = musicSheet.map((note, index) => ({
        ...note,
        status: index === 0 ? 'current' : 'waiting',
      }));
      
      setMusicSheet(resetSheet);
      setCurrentNoteIndex(0);
      setIsPlaying(false);
      setIsCompleted(false);
      stopAllSounds();
    }
  }, [musicSheet]);

  // Play/pause music
  const handlePlayPause = useCallback(() => {
    if (!isAudioInitialized || musicSheet.length === 0 || isCompleted) return;
    
    if (isPlaying) {
      setIsPlaying(false);
      stopAllSounds();
    } else {
      setIsPlaying(true);
      
      // Convert music sheet to a playable sequence
      const sequence = musicSheet.map(note => ({
        note: note.note,
        duration: note.duration,
      }));
      
      // Play the sequence
      const totalDuration = playNoteSequence(sequence, (index) => {
        // Update current note indicator as notes play
        setCurrentNoteIndex(index);
        
        // Update sheet to show which note is current
        setMusicSheet(prev => 
          prev.map((note, i) => {
            if (i === index) {
              return { ...note, status: 'current' };
            } else if (i < index) {
              // Keep previous statuses (correct/incorrect/missed)
              return note;
            } else {
              return { ...note, status: 'waiting' };
            }
          })
        );
      });
      
      // Set a timeout to stop playing when complete
      setTimeout(() => {
        setIsPlaying(false);
        setIsCompleted(true);
        
        // Mark any remaining 'waiting' or 'current' notes as 'missed'
        setMusicSheet(prev => 
          prev.map(note => {
            if (note.status === 'waiting' || note.status === 'current') {
              return { ...note, status: 'missed' };
            }
            return note;
          })
        );
      }, totalDuration * 1000 + 500); // Add a small buffer
    }
  }, [isPlaying, musicSheet, isAudioInitialized, isCompleted]);

  // Handle key press for piano
  const handleKeyPress = useCallback((note: string) => {
    if (!isPlaying || isCompleted || musicSheet.length === 0) {
      // Just play the note when not in game mode
      playNote(note);
      return;
    }
    
    // Check if the pressed note matches the current note
    const currentNote = musicSheet[currentNoteIndex];
    if (currentNote && currentNote.status === 'current') {
      const isCorrect = currentNote.note === note;
      
      // Update the status of the current note
      setMusicSheet(prev => 
        prev.map((n, i) => {
          if (i === currentNoteIndex) {
            return { 
              ...n, 
              status: isCorrect ? 'correct' : 'incorrect' 
            };
          }
          return n;
        })
      );
      
      // Move to the next note if available
      if (currentNoteIndex < musicSheet.length - 1) {
        const nextIndex = currentNoteIndex + 1;
        setCurrentNoteIndex(nextIndex);
        
        // Update the next note to 'current'
        setMusicSheet(prev => 
          prev.map((n, i) => {
            if (i === nextIndex) {
              return { ...n, status: 'current' };
            }
            return n;
          })
        );
      } else {
        // End of sheet
        setIsCompleted(true);
        setIsPlaying(false);
      }
    }
  }, [currentNoteIndex, musicSheet, isPlaying, isCompleted]);

  // Generate a sheet on first render
  useEffect(() => {
    if (isAudioInitialized && musicSheet.length === 0) {
      handleGenerateSheet();
    }
  }, [isAudioInitialized, musicSheet.length, handleGenerateSheet]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-secondary p-6 md:p-12">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-light tracking-tight text-gray-900">
          Key<span className="text-primary">Tune</span>Pal
        </h1>
        <p className="mt-2 text-muted-foreground">
          Learn to play piano with your keyboard
        </p>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-8">
        <MusicSheet 
          notes={musicSheet} 
          currentNoteIndex={currentNoteIndex} 
        />
        
        <ControlPanel
          musicSheet={musicSheet}
          isPlaying={isPlaying}
          isCompleted={isCompleted}
          onGenerate={handleGenerateSheet}
          onRetry={handleRetry}
          onPlayPause={handlePlayPause}
        />
        
        <PianoKeyboard 
          currentNote={musicSheet[currentNoteIndex] || null}
          onKeyPress={handleKeyPress}
        />
      </main>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>Press keys to play notes. Follow along with the music sheet.</p>
      </footer>
    </div>
  );
};

export default Index;
