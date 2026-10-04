import { useState } from "react";
import { Button, AmountChip, IconButton, InfoBanner } from "./novakit";

const TIERS = [5000, 10000, 15000];

export default function TermsOffer({ onBack, onContinue }) {
  const [amount, setAmount] = useState(null);

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-y-auto p-4 space-y-5">
        <header className="space-y-4">
          <IconButton onClick={onBack} aria-label="Back">
            <ChevronLeft />
          </IconButton>
          <h1 className="text-display text-neutral-900">
            How much do you want to borrow?
          </h1>
        </header>
        <div className="flex gap-2" role="group" aria-label="Advance amount">
          {TIERS.map((tier) => (
            <AmountChip
              key={tier}
              amount={tier}
              selected={amount === tier}
              onClick={() => setAmount(tier)}
            />
          ))}
        </div>
        <InfoBanner icon="i">
          A slice of your salary, early. One 3% fee, repaid on payday, nothing else.
        </InfoBanner>
      </main>
      <div className="shrink-0 p-4 border-t border-neutral-100 bg-white">
        <Button
          size="lg"
          disabled={amount == null}
          onClick={() => onContinue?.(amount)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 4.5L7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
