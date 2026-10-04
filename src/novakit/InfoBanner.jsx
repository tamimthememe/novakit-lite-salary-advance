/**
 * InfoBanner — NovaKit Lite extension
 * Calm notice strip: icon slot + text.
 * Tones: neutral (soft grey) | accent (amber awareness — not an alarm).
 */
export default function InfoBanner({
  icon,
  children,
  tone = "neutral",
  className = "",
}) {
  const tones = {
    neutral: {
      surface: "bg-neutral-50",
      iconWrap: "bg-neutral-100 text-neutral-700",
      body: "text-caption text-neutral-700",
    },
    accent: {
      surface: "bg-accent-50",
      iconWrap: "bg-accent-100 text-accent-600",
      body: "text-neutral-900",
    },
  };

  const t = tones[tone] || tones.neutral;

  return (
    <div
      className={`flex items-start gap-3 rounded-md p-4 ${t.surface} ${className}`}
      role="note"
    >
      <div
        className={
          `h-8 w-8 shrink-0 rounded-full flex items-center justify-center ` +
          `text-caption font-semibold ${t.iconWrap}`
        }
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className={`min-w-0 flex-1 ${t.body}`}>{children}</div>
    </div>
  );
}
