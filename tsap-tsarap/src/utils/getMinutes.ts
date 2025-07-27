export default function (ms: number) {
  if (!ms) {
    return 0;
  }

  return ms / 1000 / 60;
}
