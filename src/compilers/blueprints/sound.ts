/**
 * Sound blueprint. The code that uses this file
 * must replace:
 * - $pin with the sound pin
 * - $freq_array with a comma separated string of values
 * - $duration_array with a comma separated string of durations
 * - $size with the generated notes array size
 */
export default {
  definition:`
  // sound
  #define SOUND_PIN $pin
  #define SOUND_SIZE $size
  int soundCounter = 0;
  int soundTicksRemaining = 0;
  const int SOUND_FREQ[SOUND_SIZE] = {$freq_array};
  const byte SOUND_DURATION[SOUND_SIZE] = {$duration_array};
  `,
  setup: `
  // sound
  pinMode(SOUND_PIN, OUTPUT);
  `,
  loop: `
  // sound: square wave
  if (soundCounter < SOUND_SIZE) {
    if (soundTicksRemaining == 0) {
      tone(SOUND_PIN, SOUND_FREQ[soundCounter], SOUND_DURATION[soundCounter] * FRAME_LENGTH_MS);
      soundTicksRemaining = SOUND_DURATION[soundCounter] - 1;
      soundCounter++;
    } else {
      soundTicksRemaining--;
    }
  } else noTone(SOUND_PIN);
  `
}