import type { CSSProperties } from "react";

export function rangeProgressStyle(
  value: number,
  min: number,
  max: number,
): CSSProperties & { "--range-progress": string } {
  const progress = max > min
    ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
    : 0;

  return { "--range-progress": `${progress}%` };
}
