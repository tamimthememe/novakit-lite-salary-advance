/**
 * IconButton — NovaKit Lite extension
 * Circular icon button for navigation and compact actions.
 * States: default, pressed (active)
 *
 * Minimal addition: the starter kit had no icon-button pattern;
 * uses existing neutral tokens only.
 */
export default function IconButton({
  children,
  onClick,
  "aria-label": ariaLabel,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={
        `h-10 w-10 inline-flex items-center justify-center rounded-full ` +
        `bg-neutral-100 text-neutral-700 active:bg-neutral-200 ` +
        `transition-colors select-none shrink-0 ${className}`
      }
    >
      {children}
    </button>
  );
}
