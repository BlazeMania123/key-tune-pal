
// Available notes for random generation
const availableNotes = [
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5',
];

// Possible durations for notes (in seconds)
const possibleDurations = [0.5, 0.75, 1, 1.5];

// Note type definition
export interface MusicNote {
  id: string;
  note: string;
  duration: number;
  // Status can be 'waiting', 'current', 'correct', 'incorrect', or 'missed'
  status: 'waiting' | 'current' | 'correct' | 'incorrect' | 'missed';
}

// Generate a random music sheet
export const generateRandomMusicSheet = (noteCount: number = 8): MusicNote[] => {
  const sheet: MusicNote[] = [];
  
  for (let i = 0; i < noteCount; i++) {
    const randomNoteIndex = Math.floor(Math.random() * availableNotes.length);
    const randomNote = availableNotes[randomNoteIndex];
    
    const randomDurationIndex = Math.floor(Math.random() * possibleDurations.length);
    const randomDuration = possibleDurations[randomDurationIndex];
    
    sheet.push({
      id: `note-${i}-${Date.now()}`,
      note: randomNote,
      duration: randomDuration,
      status: i === 0 ? 'current' : 'waiting',
    });
  }
  
  return sheet;
};

// Calculate accuracy percentage
export const calculateAccuracy = (sheet: MusicNote[]): number => {
  const totalNotes = sheet.length;
  const correctNotes = sheet.filter(note => note.status === 'correct').length;
  
  return Math.round((correctNotes / totalNotes) * 100);
};

// Get accuracy rating
export const getAccuracyRating = (accuracy: number): string => {
  if (accuracy >= 90) {
    return 'Perfect!';
  } else if (accuracy >= 75) {
    return 'Great job!';
  } else if (accuracy >= 50) {
    return 'Good effort!';
  } else {
    return 'Keep practicing!';
  }
};

// Get accuracy class for styling
export const getAccuracyClass = (accuracy: number): string => {
  if (accuracy >= 75) {
    return 'high';
  } else if (accuracy >= 50) {
    return 'medium';
  } else {
    return 'low';
  }
};
