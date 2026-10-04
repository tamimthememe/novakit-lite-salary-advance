/**
 * ListRow / TransactionRow — NovaKit Lite
 * leading icon · title + subtitle · trailing amount
 */
const ICON_TONES = {
  neutral:
    "h-9 w-9 shrink-0 rounded-full flex items-center justify-center bg-neutral-100 text-neutral-700",
  accent:
    "h-9 w-9 shrink-0 rounded-full flex items-center justify-center bg-accent-100 text-accent-600",
  success:
    "h-9 w-9 shrink-0 rounded-full flex items-center justify-center bg-success-50 text-success",
};

export default function ListRow({
  icon = null,
  iconTone = "neutral",
  title,
  subtitle,
  trailing = null,
  className = "",
  style,
  onAnimationEnd,
}) {
  return (
    <div
      className={
        "flex items-center gap-3 py-3 border-b border-[#DADADA] last:border-b-0 " +
        className
      }
      style={style}
      onAnimationEnd={onAnimationEnd}
    >
      {icon ? (
        <div className={ICON_TONES[iconTone] || ICON_TONES.neutral}>{icon}</div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="text-body text-neutral-900 truncate">{title}</div>
        {subtitle ? (
          <div className="text-caption text-neutral-500 truncate">{subtitle}</div>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
