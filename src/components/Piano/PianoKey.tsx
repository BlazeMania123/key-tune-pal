
import { useEffect, useState } from 'react';
import { keyMap, playNote } from '@/utils/audioUtils';

interface PianoKeyProps {
  note: string;
  keyLabel: string;
  type: 'white' | 'black';
  position?: number;
  active?: boolean;
  feedback?: 'correct' | 'incorrect' | null;
  onKeyClick?: (note: string) => void;
}

const PianoKey = ({
  note,
  keyLabel,
  type,
  position = 0,
  active = false,
  feedback = null,
  onKeyClick,
}: PianoKeyProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    playNote(note);
    if (onKeyClick) {
      onKeyClick(note);
    }
  };

  useEffect(() => {
    if (active) {
      setIsPressed(true);
      const timer = setTimeout(() => {
        setIsPressed(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [active]);

  const getKeyClasses = () => {
    const baseClass = type === 'white' ? 'piano-white-key' : 'piano-black-key';
    let classes = baseClass;
    
    if (isPressed || active) {
      classes += ' active animate-key-press';
    }
    
    if (feedback === 'correct') {
      classes += ' correct';
    } else if (feedback === 'incorrect') {
      classes += ' incorrect';
    }
    
    return classes;
  };

  const getPositionStyle = () => {
    if (type === 'black') {
      // Position the black key
      return { left: `${position}%` };
    }
    return {};
  };

  return (
    <div
      className={getKeyClasses()}
      style={getPositionStyle()}
      onClick={handleClick}
    >
      <span className="uppercase">{keyLabel}</span>
    </div>
  );
};

export default PianoKey;
