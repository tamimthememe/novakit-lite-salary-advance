/**
 * AmountText — NovaKit Lite
 * Formats an integer PKR amount, e.g. 10000 -> "Rs 10,000".
 * signed: "in" (+ success-700) | "out" (− neutral) | null (unsigned neutral)
 */
const SIZES = {
  display: "text-display",
  title: "text-title",
  body: "text-body",
};

const SIGNED_COLOR = {
  in: "text-success-700",
  out: "text-neutral-900",
};

export default function AmountText({
  amount,
  size = "title",
  signed = null,
  className = "",
}) {
  const formatted = new Intl.NumberFormat("en-PK").format(amount ?? 0);
  const prefix = signed === "in" ? "+" : signed === "out" ? "−" : "";
  const sizeClass = SIZES[size] || SIZES.title;
  const colorClass = SIGNED_COLOR[signed] || "text-neutral-900";

  return (
    <span className={`${sizeClass} ${colorClass} ${className}`}>
      {prefix}Rs {formatted}
    </span>
  );
}
