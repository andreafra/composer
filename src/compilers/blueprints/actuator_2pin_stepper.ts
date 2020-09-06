/**
 * Actuator blueprint for a stepper motor using a 2 pin.
 * The code that uses this file must replace:
 * - $pin1, $pin2 are the control signal
 * - $const1 is the number of steps
 * - $var1 is the speed
 * - $var2 is the steps to rotate
 * - $array_values with a concatenated string of $id_TYPE struct elements
 * - $size with the generated array size
 */
export default {
  definition:`
  // actuator: $id
  #include <Stepper.h>
  #define $id_PIN1 $pin1
  #define $id_PIN2 $pin2
  #define $id_STEPS $const1

  #define $id_SIZE $size
  Stepper $id_stepper($id_STEPS, $id_PIN1, $id_PIN2);
  typedef struct $id_TYPE {
    int start, end;
    byte speed;
    int steps;
  } $id_TYPE;
  const $id_TYPE $id[$id_SIZE] = {$array_values};
  byte $id_currFrameIndex = 0;
  `,
  setup: ``,
  loop: `
  // actuator: $id
  if ($id_currFrameIndex < $id_SIZE) {
    if (currentFrame == $id[$id_currFrameIndex].end + 1) {
      $id_stepper.setSpeed(0);
      $id_stepper.step(0);
      $id_currFrameIndex++;
    }
    if (currentFrame == $id[$id_currFrameIndex].start) {
      $id_stepper.setSpeed($id[$id_currFrameIndex].speed);
      $id_stepper.step($id[$id_currFrameIndex].steps);
    }
  }
  `,
  item: `{$start, $end, $var1, $var2}`
}