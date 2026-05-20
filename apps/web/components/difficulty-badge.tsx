const DOTS: Record<string, string> = {
  "Easy":      "difficulty-dot--easy",
  "Medium":    "difficulty-dot--medium",
  "Hard":      "difficulty-dot--hard",
  "Very Hard": "difficulty-dot--very-hard",
};

export function DifficultyBadge({ value }: { value: string }) {
  const dotClass = DOTS[value];
  return (
    <span className="difficulty-badge">
      {dotClass ? <span className={`difficulty-dot ${dotClass}`} aria-hidden="true" /> : null}
      {value}
    </span>
  );
}
