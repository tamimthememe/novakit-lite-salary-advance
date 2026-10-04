import { Button, BottomSheet } from "./novakit";

/**
 * Accept failure — bottom sheet over confirm.
 * Confirms nothing moved; offer underneath stays intact.
 */
export default function AcceptFailureSheet({ open, onTryAgain, onNotNow }) {
  return (
    <BottomSheet open={open} onClose={onNotNow}>
      <div className="flex flex-col items-center text-center pt-1">
        <div
          className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-600"
          aria-hidden="true"
        >
          <AlertGlyph />
        </div>

        <h2 className="mt-3 text-title text-neutral-900">
          Something went wrong on our end
        </h2>

        <p className="mt-3 text-body font-semibold text-neutral-900 text-balance">
          Nothing has been charged or added to your wallet. Your balance is
          unchanged.
        </p>

        <div className="w-full space-y-2 mt-3">
          <Button size="lg" onClick={onTryAgain}>
            Try again
          </Button>
          <button
            type="button"
            onClick={onNotNow}
            className="w-full h-11 text-body font-semibold text-neutral-700 active:bg-neutral-100 rounded-md"
          >
            Not now
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

function AlertGlyph() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="14"
        cy="14"
        r="10.25"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M14 9v7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="14" cy="19.5" r="1.15" fill="currentColor" />
    </svg>
  );
}
