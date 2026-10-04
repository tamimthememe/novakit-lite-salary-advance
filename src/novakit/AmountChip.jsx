/**
 * AmountChip — NovaKit Lite extension
 * Selectable amount for salary-advance tiers.
 * States: default | selected
 *
 * Minimal addition: chip affordance wasn't in the starter kit;
 * tokens and type scale match Button / Card.
 */
export default function AmountChip({
  amount,
  selected = false,
  onClick,
  className = "",
}) {
  const formatted = new Intl.NumberFormat("en-PK").format(amount ?? 0);

  const state = selected
    ? "bg-brand-50 border-brand text-brand-800"
    : "bg-white border-neutral-300 text-neutral-900 active:bg-neutral-100";

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={
        `flex-1 h-12 px-2 rounded-md border text-body font-semibold ` +
        `transition-colors select-none ${state} ${className}`
      }
    >
      Rs {formatted}
    </button>
  );
}
