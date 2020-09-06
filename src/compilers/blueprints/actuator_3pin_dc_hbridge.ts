/**
 * Actuator blueprint for a DC motor using a PWM pin and two digital with an H Bridge.
 * The code that uses this file must replace:
 * - $pin1 is PWM
 * - $pin2, $pin3 controls the H bridge
 * - $var1 is the speed (PWM)
 * - $var2, $var3 is the value of the H bridge
 *   (both HIGH = brake, in1 = HIGH & in2 = LOW is "forward" and in1 = LOW & in2 = HIGH is "backward")
 * - $array_values with a concatenated string of $id_TYPE struct elements
 * - $size with the generated array size
 */
export default {
  definition:`
  // actuator: $id
  #include <Stepper.h>
  #define $id_PIN1 $pin1
  #define $id_PIN2 $pin2
  #define $id_PIN3 $pin3

  #define $id_SIZE $size
  typedef struct $id_TYPE {
    int start, end;
    byte speed;
    byte in1, in2;
  } $id_TYPE;
  const $id_TYPE $id[$id_SIZE] = {$array_values};
  byte $id_currFrameIndex = 0;
  `,
  setup: ``,
  loop: `
  // actuator: $id
  if ($id_currFrameIndex < $id_SIZE) {
    if (currentFrame == $id[$id_currFrameIndex].end + 1) {
      analogWrite($id_PIN1, 0);
      digitalWrite($id_PIN2,HIGH);
      digitalWrite($id_PIN3,HIGH);
      $id_currFrameIndex++;
    }
    if (currentFrame == $id[$id_currFrameIndex].start) {
      analogWrite($id_PIN1, $id[$id_currFrameIndex].speed);
      digitalWrite($id_PIN2, $id[$id_currFrameIndex].in1);
      digitalWrite($id_PIN3, $id[$id_currFrameIndex].in2);
    }
  }
  `,
  item: `{$start, $end, $var1, $var2, $var3}`
}