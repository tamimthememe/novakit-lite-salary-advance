import { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Card,
  ListRow,
  Button,
  AmountText,
  Toast,
  InfoBanner,
} from "./novakit";
import TermsOffer from "./TermsOffer.jsx";
import ConfirmAdvance from "./ConfirmAdvance.jsx";
import AdvanceSuccess from "./AdvanceSuccess.jsx";
import AcceptFailureSheet from "./AcceptFailure.jsx";

const BASE_BALANCE = 4250;
const COUNT_MS = 700;
const TOAST_MS = 3000;
const REPAYMENT_DATE = "28 Oct 2026";

/** Demo-only haircut map for the "Partial approval" scenario. */
const PARTIAL_DISBURSED = {
  5000: 5000,
  10000: 8000,
  15000: 12000,
};

function resolveDisbursedAmount(applied, scenario) {
  if (scenario === "partial") {
    return PARTIAL_DISBURSED[applied] ?? applied;
  }
  return applied;
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function formatRs(amount) {
  return `Rs ${new Intl.NumberFormat("en-PK").format(amount ?? 0)}`;
}

function formatActivityTime(date) {
  const time = (date ?? new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `Today, ${time}`;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Starter app — NovaPay home in a mobile frame.
 *
 * Flow: home → amount select → confirm → success → home (balance + toast).
 */
export default function App() {
  const [screen, setScreen] = useState("home");
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [accepted, setAccepted] = useState(null);
  // Outstanding advance on home — set on Accept, hides the offer card.
  const [activeAdvance, setActiveAdvance] = useState(null);
  const [balance, setBalance] = useState(BASE_BALANCE);
  // When set, home animates balance from this value → current balance.
  const [balanceFrom, setBalanceFrom] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "" });
  // Bumps on each home visit so activity rows can re-enter.
  const [homeEntranceKey, setHomeEntranceKey] = useState(0);
  // True only when landing home right after a completed advance.
  const [highlightAdvance, setHighlightAdvance] = useState(false);
  // Reviewer-only: full vs partial (haircut) approval path.
  const [scenario, setScenario] = useState("full");
  // Reviewer-only: first Accept shows failure sheet; retry always succeeds.
  const [simulateAcceptFailure, setSimulateAcceptFailure] = useState(false);
  const [acceptFailureOpen, setAcceptFailureOpen] = useState(false);
  const [pendingAccept, setPendingAccept] = useState(null);
  const reducedMotion = usePrefersReducedMotion();
  const disbursedAmount = resolveDisbursedAmount(selectedAmount, scenario);

  useEffect(() => {
    if (screen === "home") {
      setHomeEntranceKey((k) => k + 1);
    }
  }, [screen]);

  function resetFlow() {
    setScreen("home");
    setSelectedAmount(5000);
    setAccepted(null);
    setActiveAdvance(null);
    setBalance(BASE_BALANCE);
    setBalanceFrom(null);
    setToast({ open: false, message: "" });
    setHighlightAdvance(false);
    setPendingAccept(null);
    setAcceptFailureOpen(false);
  }

  function handleScenarioChange(next) {
    setScenario(next);
    resetFlow();
  }

  function handleContinue(amount) {
    setSelectedAmount(amount);
    setScreen("confirm");
  }

  function completeAccept({ amount, fee, total }) {
    setAccepted({ amount, fee, total, acceptedAt: new Date() });
    setPendingAccept(null);
    setScreen("success");
  }

  function handleAccept(payload) {
    if (simulateAcceptFailure) {
      setPendingAccept(payload);
      setAcceptFailureOpen(true);
      return;
    }
    completeAccept(payload);
  }

  function handleRetryAccept() {
    setAcceptFailureOpen(false);
    if (pendingAccept) {
      completeAccept(pendingAccept);
    }
  }

  function handleDismissAcceptFailure() {
    setAcceptFailureOpen(false);
  }

  function handleDone() {
    if (!accepted) {
      setScreen("home");
      return;
    }

    const added = accepted.amount;
    const from = balance;
    const to = balance + added;

    setActiveAdvance(accepted);
    setHighlightAdvance(true);
    setBalanceFrom(from);
    setBalance(to);
    setToast({
      open: true,
      message: `${formatRs(added)} added to your wallet`,
    });
    setAccepted(null);
    setScreen("home");

    window.setTimeout(() => {
      setToast({ open: false, message: "" });
    }, TOAST_MS);
  }

  function activityRowClass(index, isNewAdvance = false) {
    if (reducedMotion) return "";
    if (isNewAdvance && highlightAdvance) return "activity-row-enter-new";
    return "activity-row-in";
  }

  function activityRowStyle(index, isNewAdvance = false) {
    if (reducedMotion) return undefined;
    if (isNewAdvance && highlightAdvance) return undefined;
    return { animationDelay: `${index * 40}ms` };
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 py-6 px-4">
      {/* Mobile frame — product UI only */}
      <div className="relative w-[390px] h-[844px] bg-white rounded-[28px] shadow-xl overflow-hidden border border-neutral-300 shrink-0">
        {screen === "offer" ? (
          <TermsOffer
            onBack={() => setScreen("home")}
            onContinue={handleContinue}
          />
        ) : screen === "confirm" ? (
          <>
            <ConfirmAdvance
              amount={disbursedAmount}
              appliedAmount={selectedAmount}
              onBack={() => setScreen("offer")}
              onAccept={handleAccept}
              onNotNow={() => setScreen("home")}
            />
            <AcceptFailureSheet
              open={acceptFailureOpen}
              onTryAgain={handleRetryAccept}
              onNotNow={handleDismissAcceptFailure}
            />
          </>
        ) : screen === "success" && accepted ? (
          <AdvanceSuccess
            amount={accepted.amount}
            total={accepted.total}
            onDone={handleDone}
          />
        ) : (
          <>
            <AppBar title="NovaPay" />

            <main className="p-4 space-y-4">
              <Card>
                <div className="text-caption text-neutral-500">Available balance</div>
                <div className="mt-1">
                  <AnimatedBalance
                    amount={balance}
                    from={balanceFrom}
                    onComplete={() => setBalanceFrom(null)}
                  />
                </div>
              </Card>

              {activeAdvance ? (
                <InfoBanner tone="accent" icon="i">
                  <div className="text-body font-semibold text-neutral-900 leading-snug">
                    Active advance
                  </div>
                  <div className="text-body text-neutral-700 leading-snug">
                    {formatRs(activeAdvance.total)} due on {REPAYMENT_DATE}
                  </div>
                </InfoBanner>
              ) : (
                <Card className="space-y-3">
                  <div>
                    <div className="text-title text-neutral-900">
                      You&apos;re approved for an advance
                    </div>
                    <div className="text-body text-neutral-700 mt-1">
                      An advance against your salary, repaid on payday.
                    </div>
                  </div>
                  <Button size="lg" onClick={() => setScreen("offer")}>
                    See your offer
                  </Button>
                </Card>
              )}

              <Card key={homeEntranceKey}>
                <div className="text-caption text-neutral-500 mb-1">Recent activity</div>
                {activeAdvance ? (
                  <ListRow
                    icon={<WalletGlyph />}
                    iconTone="success"
                    title="Salary advance"
                    subtitle={formatActivityTime(activeAdvance.acceptedAt)}
                    trailing={
                      <AmountText
                        amount={activeAdvance.amount}
                        size="body"
                        signed="in"
                      />
                    }
                    className={activityRowClass(0, true)}
                    style={activityRowStyle(0, true)}
                    onAnimationEnd={(e) => {
                      if (e.animationName === "activity-row-highlight") {
                        setHighlightAdvance(false);
                      }
                    }}
                  />
                ) : null}
                <ListRow
                  icon="↑"
                  title="Sent to Ahmed K."
                  subtitle="3 Oct"
                  trailing={
                    <AmountText amount={1500} size="body" signed="out" />
                  }
                  className={activityRowClass(activeAdvance ? 1 : 0)}
                  style={activityRowStyle(activeAdvance ? 1 : 0)}
                />
                <ListRow
                  icon="↓"
                  iconTone="success"
                  title="Salary credited"
                  subtitle="28 Sep"
                  trailing={
                    <AmountText amount={68000} size="body" signed="in" />
                  }
                  className={activityRowClass(activeAdvance ? 2 : 1)}
                  style={activityRowStyle(activeAdvance ? 2 : 1)}
                />
                <ListRow
                  icon="↑"
                  title="Mobile top-up"
                  subtitle="25 Sep"
                  trailing={
                    <AmountText amount={500} size="body" signed="out" />
                  }
                  className={activityRowClass(activeAdvance ? 3 : 2)}
                  style={activityRowStyle(activeAdvance ? 3 : 2)}
                />
              </Card>
            </main>

            <Toast open={toast.open} message={toast.message} />
          </>
        )}
      </div>

      <DemoControls
        scenario={scenario}
        onScenarioChange={handleScenarioChange}
        simulateAcceptFailure={simulateAcceptFailure}
        onSimulateAcceptFailureChange={setSimulateAcceptFailure}
        onReset={resetFlow}
      />
    </div>
  );
}

/** Reviewer tool — outside the phone frame, not part of the product UI. */
function DemoControls({
  scenario,
  onScenarioChange,
  simulateAcceptFailure,
  onSimulateAcceptFailureChange,
  onReset,
}) {
  return (
    <aside className="w-full max-w-[390px] lg:max-w-[220px] lg:sticky lg:top-6 shrink-0 rounded-md border border-neutral-300 bg-neutral-50 p-4 text-left">
      <div className="text-caption font-semibold text-neutral-500 uppercase tracking-wide">
        Demo controls
      </div>
      <p className="text-caption text-neutral-500 mt-1 mb-3">
        Reviewer tools — not shown in the product.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="w-full h-10 rounded-md border border-neutral-300 bg-white text-body text-neutral-900 active:bg-neutral-100"
      >
        Reset flow
      </button>

      <fieldset className="mt-4 border-0 p-0 m-0">
        <legend className="text-caption text-neutral-700 mb-2">Scenario</legend>
        <label className="flex items-start gap-2 text-body text-neutral-900 cursor-pointer">
          <input
            type="radio"
            name="demo-scenario"
            className="mt-1"
            checked={scenario === "full"}
            onChange={() => onScenarioChange("full")}
          />
          <span>
            Full approval
            <span className="block text-caption text-neutral-500">
              Gets the amount they pick.
            </span>
          </span>
        </label>
        <label className="flex items-start gap-2 text-body text-neutral-900 cursor-pointer mt-2">
          <input
            type="radio"
            name="demo-scenario"
            className="mt-1"
            checked={scenario === "partial"}
            onChange={() => onScenarioChange("partial")}
          />
          <span>
            Partial approval
            <span className="block text-caption text-neutral-500">
              10k→8k, 15k→12k. 5k still full.
            </span>
          </span>
        </label>
      </fieldset>

      <label className="flex items-start gap-2 text-body text-neutral-900 cursor-pointer mt-4 pt-4 border-t border-neutral-200">
        <input
          type="checkbox"
          className="mt-1"
          checked={simulateAcceptFailure}
          onChange={(e) => onSimulateAcceptFailureChange(e.target.checked)}
        />
        <span>
          Simulate accept failure
          <span className="block text-caption text-neutral-500">
            Accept opens a sheet; retry succeeds.
          </span>
        </span>
      </label>
    </aside>
  );
}

function WalletGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="7"
        width="21"
        height="15"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.5 11.5h21"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="19.5" cy="16.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

/**
 * Counts from `from` → `amount` only when `from` is set (post-advance home).
 * Soft settle after count; instant under reduced motion.
 */
function AnimatedBalance({ amount, from, onComplete }) {
  const reducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(amount);
  const [settle, setSettle] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (from == null) {
      setDisplay(amount);
      setSettle(false);
      return undefined;
    }

    if (reducedMotion) {
      setDisplay(amount);
      setSettle(false);
      onCompleteRef.current?.();
      return undefined;
    }

    setSettle(false);
    setDisplay(from);
    const start = performance.now();
    let raf = 0;

    function tick(now) {
      const t = Math.min(1, (now - start) / COUNT_MS);
      setDisplay(Math.round(from + (amount - from) * easeOutCubic(t)));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(amount);
        setSettle(true);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, amount, reducedMotion]);

  return (
    <span
      className={settle ? "balance-settle" : undefined}
      onAnimationEnd={() => {
        if (!settle) return;
        setSettle(false);
        onCompleteRef.current?.();
      }}
    >
      <AmountText amount={display} size="display" />
    </span>
  );
}
