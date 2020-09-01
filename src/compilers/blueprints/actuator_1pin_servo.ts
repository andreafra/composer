/**
 * Actuator blueprint for a servo motor using a PWM pin.
 * The code that uses this file must replace:
 * - $pin1 is the servo signal
 * - $array_values with a concatenated string of $id_TYPE struct elements
 * - $size with the generated array size
 */
export default {
  definition:`
  // actuator: $id
  #include <Servo.h>
  #define $id_PIN1 $pin1
  #define $id_SIZE $size
  Servo $id_servo;
  typedef struct $id_TYPE {
    int start, end;
    byte value;
  } $id_TYPE;
  const $id_TYPE $id[$id_SIZE] = {$array_values};
  byte $id_currFrameIndex = 0;
  `,
  setup: `
  // actuator: $id
  $id_servo.attach($id_PIN1);
  $id_servo.write(90);
  `,
  loop: `
  // actuator: $id
  if ($id_currFrameIndex < $id_SIZE) {
    if (currentFrame == $id[$id_currFrameIndex].start) {
      $id_servo.write($id[$id_currFrameIndex].value);
      $id_currFrameIndex++;
    }
  }
  `,
  item: `{$start, $end, $var1}`
}