export function hapticTick() {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  navigator.vibrate(15);
}
