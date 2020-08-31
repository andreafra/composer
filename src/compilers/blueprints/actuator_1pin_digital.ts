/**
 * Actuator blueprint. The code that uses this file
 * must replace:
 * - %pin1 with the pin1 value
 * - %array_values with a concatenated string of
 *   $id_TYPE struct elements
 * - %size with the generated notes array size
 */
export default {
  definition:`
  // actuator: $id
  #define $id_PIN1 $pin1
  #define $id_SIZE $size
  typedef struct $id_TYPE {
    int start, end;
    byte pin1;
  } $id_TYPE;
  const $id_TYPE $id[$id_SIZE] = {$array_values};
  byte $id_currFrameIndex = 0;
  `,
  setup: `
  // actuator $id
  pinMode($pin1, OUTPUT);
  `,
  loop: `
  // actuator: $id
  if ($id_currFrameIndex < $id_SIZE) {
    if (currentFrame == $id[$id_currFrameIndex].start) {
      digitalWrite($id_PIN1, $id[$id_currFrameIndex].pin1);
    }
    if (currentFrame == $id[$id_currFrameIndex].end + 1) {
      digitalWrite($id_PIN1, LOW);
      $id_currFrameIndex++;
    }
  }
  `,
  item: `{$start, $end, $pin1}`
}