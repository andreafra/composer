/**
 * Actuator blueprint for a single PWM pin.
 * The code that uses this file must replace:
 * - $pin1 = R $pin2 = G $pin3 = B
 * - $array_values with a concatenated string of $id_TYPE struct elements
 * - $size with the generated array size
 */
export default {
  definition:`
  // actuator: $id
  #define $id_PIN1 $pin1
  #define $id_PIN2 $pin2
  #define $id_PIN3 $pin3
  #define $id_SIZE $size
  typedef struct $id_TYPE {
    int start, end;
    byte pin1, pin2, pin3;
  } $id_TYPE;
  const $id_TYPE $id[$id_SIZE] = {$array_values};
  byte $id_currFrameIndex = 0;
  `,
  setup: `
  // actuator: $id
  pinMode($id_PIN1, OUTPUT);
  pinMode($id_PIN2, OUTPUT);
  pinMode($id_PIN3, OUTPUT);
  `,
  loop: `
  // actuator: $id
  if ($id_currFrameIndex < $id_SIZE) {
    if (currentFrame == $id[$id_currFrameIndex].end + 1) {
      digitalWrite($id_PIN1, LOW);
      digitalWrite($id_PIN2, LOW);
      digitalWrite($id_PIN3, LOW);
      $id_currFrameIndex++;
    }
    if (currentFrame == $id[$id_currFrameIndex].start) {
      digitalWrite($id_PIN1, $id[$id_currFrameIndex].pin1);
      digitalWrite($id_PIN2, $id[$id_currFrameIndex].pin2);
      digitalWrite($id_PIN3, $id[$id_currFrameIndex].pin3);
    }
  }
  `,
  item: `{$start, $end, $pin1, $pin2, $pin3}`
}