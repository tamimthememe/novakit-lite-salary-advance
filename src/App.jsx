import { useEffect, useRef, useState } from "react";
import {
  AppBar, Card, ListRow, Button, AmountText, Toast,
} from "./novakit";
import TermsOffer from "./TermsOffer.jsx";
import ConfirmAdvance from "./ConfirmAdvance.jsx";
import AdvanceSuccess from "./AdvanceSuccess.jsx";

const BASE_BALANCE = 4250;
const COUNT_MS = 700;
const TOAST_MS = 3000;

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function formatRs(amount) {
  return `Rs ${new Intl.NumberFormat("en-PK").format(amount ?? 0)}`;
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

export default function App() {
  const [screen, setScreen] = useState("home");
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [accepted, setAccepted] = useState(null);
  const [balance, setBalance] = useState(BASE_BALANCE);
  const [balanceFrom, setBalanceFrom] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "" });

  function handleAccept({ amount, fee, total }) {
    setAccepted({ amount, fee, total, acceptedAt: new Date() });
    setScreen("success");
  }

  function handleDone() {
    if (!accepted) {
      setScreen("home");
      return;
    }
    const added = accepted.amount;
    setBalanceFrom(balance);
    setBalance(balance + added);
    setToast({ open: true, message: `${formatRs(added)} added to your wallet` });
    setAccepted(null);
    setScreen("home");
    window.setTimeout(() => setToast({ open: false, message: "" }), TOAST_MS);
  }

  return (
    <div className="min-h-screen w-full flex justify-center py-6">
      <div className="relative w-[390px] h-[844px] bg-white rounded-[28px] shadow-xl overflow-hidden border border-neutral-300">
        {screen === "offer" ? (
          <TermsOffer
            onBack={() => setScreen("home")}
            onContinue={(amount) => {
              setSelectedAmount(amount);
              setScreen("confirm");
            }}
          />
        ) : screen === "confirm" ? (
          <ConfirmAdvance
            amount={selectedAmount}
            onBack={() => setScreen("offer")}
            onAccept={handleAccept}
            onNotNow={() => setScreen("home")}
          />
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
              <Card className="space-y-3">
                <div>
                  <div className="text-title text-neutral-900">You&apos;re approved for an advance</div>
                  <div className="text-body text-neutral-700 mt-1">An advance against your salary, repaid on payday.</div>
                </div>
                <Button size="lg" onClick={() => setScreen("offer")}>See your offer</Button>
              </Card>
              <Card>
                <div className="text-caption text-neutral-500 mb-1">Recent activity</div>
                <ListRow icon="↑" title="Sent to Ahmed K." subtitle="3 Oct" trailing={<AmountText amount={1500} size="body" />} />
                <ListRow icon="↓" title="Salary credited" subtitle="28 Sep" trailing={<AmountText amount={68000} size="body" />} />
                <ListRow icon="↑" title="Mobile top-up" subtitle="25 Sep" trailing={<AmountText amount={500} size="body" />} />
              </Card>
            </main>
            <Toast open={toast.open} message={toast.message} />
          </>
        )}
      </div>
    </div>
  );
}

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
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
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
