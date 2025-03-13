
import { useEffect, useState } from 'react';
import PianoKey from './PianoKey';
import { keyMap, noteToKey } from '@/utils/audioUtils';
import type { MusicNote } from '@/utils/musicUtils';

interface PianoKeyboardProps {
  currentNote: MusicNote | null;
  onKeyPress: (note: string) => void;
}

const PianoKeyboard = ({ currentNote, onKeyPress }: PianoKeyboardProps) => {
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});
  const [keyFeedback, setKeyFeedback] = useState<Record<string, 'correct' | 'incorrect' | null>>({});

  // Setup for white keys and black keys
  const whiteKeys = [
    { note: 'C4', key: 'a' },
    { note: 'D4', key: 's' },
    { note: 'E4', key: 'd' },
    { note: 'F4', key: 'f' },
    { note: 'G4', key: 'g' },
    { note: 'A4', key: 'h' },
    { note: 'B4', key: 'j' },
    { note: 'C5', key: 'k' },
    { note: 'D5', key: 'l' },
    { note: 'E5', key: ';' },
    { note: 'F5', key: "'" },
  ];

  const blackKeys = [
    { note: 'C#4', key: 'w', position: 7.2 },
    { note: 'D#4', key: 'e', position: 16.5 },
    { note: 'F#4', key: 't', position: 34.7 },
    { note: 'G#4', key: 'y', position: 43.8 },
    { note: 'A#4', key: 'u', position: 52.9 },
    { note: 'C#5', key: 'o', position: 71.1 },
    { note: 'D#5', key: 'p', position: 80.3 },
    { note: 'F#5', key: ']', position: 98.2 },
  ];

  // Handle key presses
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      
      if (keyMap[key] && !event.repeat) {
        setPressedKeys(prev => ({ ...prev, [key]: true }));
        onKeyPress(keyMap[key]);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      
      if (keyMap[key]) {
        setPressedKeys(prev => ({ ...prev, [key]: false }));
        
        // Clear feedback after a short delay
        setTimeout(() => {
          setKeyFeedback(prev => ({ ...prev, [key]: null }));
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKeyPress]);

  // Update feedback based on current note
  useEffect(() => {
    if (currentNote && currentNote.status === 'current') {
      // Clear previous feedback
      setKeyFeedback({});
    }
  }, [currentNote]);

  // Handle feedback for a key
  const handleKeyFeedback = (note: string, feedback: 'correct' | 'incorrect' | null) => {
    const key = noteToKey[note];
    if (key) {
      setKeyFeedback(prev => ({ ...prev, [key]: feedback }));
    }
  };

  // Handle click on a piano key
  const handleKeyClick = (note: string) => {
    onKeyPress(note);
  };

  return (
    <div className="piano-container">
      {/* White Keys */}
      <div className="flex">
        {whiteKeys.map(({ note, key }) => (
          <PianoKey
            key={note}
            note={note}
            keyLabel={key}
            type="white"
            active={pressedKeys[key]}
            feedback={keyFeedback[key]}
            onKeyClick={handleKeyClick}
          />
        ))}
      </div>

      {/* Black Keys */}
      {blackKeys.map(({ note, key, position }) => (
        <PianoKey
          key={note}
          note={note}
          keyLabel={key}
          type="black"
          position={position}
          active={pressedKeys[key]}
          feedback={keyFeedback[key]}
          onKeyClick={handleKeyClick}
        />
      ))}
    </div>
  );
};

export default PianoKeyboard;
