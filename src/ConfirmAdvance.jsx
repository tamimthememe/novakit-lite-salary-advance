import { Button, AmountText, IconButton, Panel, InfoBanner } from "./novakit";

const FEE_RATE = 0.03;
const REPAYMENT_DATE = "28 Oct 2026";

function feeFor(amount) {
  return Math.round(amount * FEE_RATE);
}

function formatRs(amount) {
  return `Rs ${new Intl.NumberFormat("en-PK").format(amount ?? 0)}`;
}

/**
 * Confirm — single point of commitment.
 * Full path: user gets what they picked.
 * Partial path: calm offered amount below what they asked for.
 */
export default function ConfirmAdvance({
  amount,
  appliedAmount = null,
  onBack,
  onAccept,
  onNotNow,
}) {
  const fee = feeFor(amount);
  const total = amount + fee;
  const isPartial =
    appliedAmount != null && appliedAmount !== amount;

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-y-auto p-4 space-y-5">
        <header className="space-y-4">
          <IconButton onClick={onBack} aria-label="Back">
            <ChevronLeft />
          </IconButton>

          <h1 className="text-display text-neutral-900">
            {isPartial
              ? `We can offer ${formatRs(amount)} right now`
              : "Confirm your advance"}
          </h1>
        </header>

        {isPartial ? (
          <div className="space-y-3">
            <InfoBanner tone="accent" icon="i">
              <p className="text-body text-neutral-900">
                You asked for {formatRs(appliedAmount)}. Based on your recent
                salary deposits, we can lend up to {formatRs(amount)} today.
              </p>
            </InfoBanner>
            <p className="text-body text-neutral-700">
              Your limit is reviewed after each on-time repayment, so it can
              grow.
            </p>
          </div>
        ) : null}

        <Panel className="space-y-3">
          <CostRow label="You borrow">
            <AmountText amount={amount} size="body" />
          </CostRow>
          <CostRow label="One-time fee (3%)">
            <AmountText amount={fee} size="body" />
          </CostRow>

          <div className="border-t border-neutral-200" />

          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-title text-neutral-900">Total to repay</span>
            <span className="text-title text-brand">{formatRs(total)}</span>
          </div>
        </Panel>

        <div className="rounded-md bg-brand-50 p-4">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 shrink-0 rounded-full bg-brand-100 flex items-center justify-center text-brand"
              aria-hidden="true"
            >
              <CalendarIcon />
            </div>
            <p className="text-body text-neutral-700 min-w-0">
              Repaid in one payment on{" "}
              <span className="font-semibold text-brand">
                {REPAYMENT_DATE}
              </span>
            </p>
          </div>
        </div>

        <p className="text-caption text-neutral-700">
          Collected automatically from your salary on payday. Nothing before
          then.
        </p>
      </main>

      <div className="shrink-0 p-4 border-t border-neutral-100 bg-white space-y-2">
        <Button
          size="lg"
          onClick={() => onAccept?.({ amount, fee, total })}
        >
          {`Accept ${formatRs(total)}`}
        </Button>
        {isPartial ? (
          <Button size="lg" variant="secondary" onClick={onNotNow}>
            Not now
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function CostRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-body text-neutral-700">{label}</span>
      {children}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="3.5"
        width="13"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M2.5 7.5h13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6 2.5v2.5M12 2.5v2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12.5 4.5L7 10l5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
