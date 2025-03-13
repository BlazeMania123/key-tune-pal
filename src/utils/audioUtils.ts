
import * as Tone from 'tone';

// Initialize the synth
let synth: Tone.PolySynth;

// Map of keyboard keys to piano notes
export const keyMap: { [key: string]: string } = {
  // White keys
  a: 'C4',
  s: 'D4',
  d: 'E4',
  f: 'F4',
  g: 'G4',
  h: 'A4',
  j: 'B4',
  k: 'C5',
  l: 'D5',
  ';': 'E5',
  "'": 'F5',

  // Black keys
  w: 'C#4',
  e: 'D#4',
  t: 'F#4',
  y: 'G#4',
  u: 'A#4',
  o: 'C#5',
  p: 'D#5',
  ']': 'F#5',
};

// Reverse mapping (note to key)
export const noteToKey: { [note: string]: string } = {};
Object.keys(keyMap).forEach(key => {
  noteToKey[keyMap[key]] = key;
});

// Initialize the synth
export const initializeAudio = async () => {
  await Tone.start();
  console.log('Audio is ready');
  
  synth = new Tone.PolySynth(Tone.Synth).toDestination();
  synth.set({
    envelope: {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.3,
      release: 1
    }
  });
};

// Play a note
export const playNote = (note: string, duration: number = 0.5) => {
  if (!synth) return;
  synth.triggerAttackRelease(note, duration);
};

// Play a sequence of notes
export const playNoteSequence = (notes: { note: string; duration: number }[], callback?: (index: number) => void) => {
  if (!synth) return;
  
  const now = Tone.now();
  let timeOffset = 0;
  
  notes.forEach((noteData, index) => {
    synth.triggerAttackRelease(
      noteData.note,
      noteData.duration,
      now + timeOffset
    );
    
    // Call the callback after the note starts
    if (callback) {
      setTimeout(() => {
        callback(index);
      }, timeOffset * 1000);
    }
    
    timeOffset += noteData.duration;
  });
  
  return timeOffset; // Return total duration
};

// Stop all current sounds
export const stopAllSounds = () => {
  if (!synth) return;
  synth.releaseAll();
};
