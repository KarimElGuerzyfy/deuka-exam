export interface WordStatus {
  label: string;
  color: string;
  bg: string;
  dot: string;
}

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function getStatus(
  count: number,
  bounds: { min: number; max: number }
): WordStatus {
  if (count === 0)
    return { label: "Start writing to track your progress", color: "#8E9AC0", bg: "#1A2036", dot: "#4A5578" };
  if (count < bounds.min * 0.5)
    return { label: "Quite short — keep going", color: "#F0C24A", bg: "#2A2410", dot: "#F0C24A" };
  if (count < bounds.min)
    return { label: "Almost in range", color: "#C9B98A", bg: "#221E12", dot: "#C7A15C" };
  if (count <= bounds.max)
    return { label: "Looks good — in range", color: "#34E0B0", bg: "#0F2A26", dot: "#34E0B0" };
  return { label: "A little long — that's fine", color: "#9AB0FF", bg: "#16203A", dot: "#6D7CB0" };
}