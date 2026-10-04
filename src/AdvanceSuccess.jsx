import { useEffect, useState } from "react";
import { Button } from "./novakit";

const REPAYMENT_DATE = "28 Oct 2026";
const REF = "NP-2026-004812";
const ICON_SETTLE_MS = 320;
const COUNT_MS = 700;
const CAPTION_DELAY_MS = 120;
const PANEL_DELAY_MS = 520;

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function formatRs(amount) {
  return `Rs ${new Intl.NumberFormat("en-PK").format(Math.round(amount ?? 0))}`;
}

/**
 * Success — minimal receipt layout, calm completion sequence.
 * Icon + single pulse → amount count-up → caption → repayment panel.
 */
export default function AdvanceSuccess({ amount, total, onDone }) {
  const [iconReady, setIconReady] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [displayAmount, setDisplayAmount] = useState(0);
  const [countDone, setCountDone] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setIconReady(true);
      requestAnimationFrame(() => setPulse(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!iconReady) return undefined;

    let raf = 0;
    const startDelay = setTimeout(() => {
      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / COUNT_MS);
        setDisplayAmount(amount * easeOutCubic(t));
        if (t < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          setDisplayAmount(amount);
          setCountDone(true);
        }
      }
      raf = requestAnimationFrame(tick);
    }, ICON_SETTLE_MS);

    return () => {
      clearTimeout(startDelay);
      cancelAnimationFrame(raf);
    };
  }, [iconReady, amount]);

  useEffect(() => {
    if (!countDone) return undefined;
    const captionTimer = setTimeout(() => setShowCaption(true), CAPTION_DELAY_MS);
    const panelTimer = setTimeout(() => setShowPanel(true), PANEL_DELAY_MS);
    return () => {
      clearTimeout(captionTimer);
      clearTimeout(panelTimer);
    };
  }, [countDone]);

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      <AmbientParticles />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 overflow-y-auto">
        <div className="w-full flex flex-col items-center gap-10">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-16 w-16 flex items-center justify-center">
              <span
                aria-hidden="true"
                className={
                  `absolute inset-0 rounded-full bg-success/20 ` +
                  `transition-all duration-700 ease-out ` +
                  (pulse
                    ? "scale-[1.85] opacity-0"
                    : "scale-100 opacity-50")
                }
              />
              <div
                className={
                  `relative h-16 w-16 rounded-full bg-success/10 text-success ` +
                  `flex items-center justify-center ` +
                  `transition-all duration-300 ease-out ` +
                  (iconReady
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95")
                }
                aria-hidden="true"
              >
                <WalletIcon />
              </div>
            </div>

            <div
              className="mt-4 text-display text-neutral-900 tabular-nums"
              aria-live="polite"
            >
              {formatRs(displayAmount)}
            </div>

            <p
              className={
                `mt-3 text-body text-neutral-700 transition-opacity duration-500 ease-out ` +
                (showCaption ? "opacity-100" : "opacity-0")
              }
            >
              Added to your wallet
            </p>
          </div>

          <div
            className={
              `w-full rounded-md bg-brand-50 px-5 py-5 space-y-3 ` +
              `transition-opacity duration-500 ease-out ` +
              (showPanel ? "opacity-100" : "opacity-0")
            }
          >
            <ReceiptRow label="Repayment">
              <span className="font-semibold text-brand">{formatRs(total)}</span>
              <span className="text-neutral-700"> on </span>
              <span className="font-semibold text-brand">{REPAYMENT_DATE}</span>
            </ReceiptRow>
            <ReceiptRow label="Reference">
              <span className="text-neutral-700">{REF}</span>
            </ReceiptRow>
          </div>
        </div>
      </main>

      <div className="relative z-10 shrink-0 p-4 border-t border-neutral-100 bg-white">
        <Button size="lg" onClick={onDone}>
          Back to home
        </Button>
      </div>
    </div>
  );
}

/** Sparse quiet float — brand/success tokens only; static under reduced motion. */
const PARTICLES = [
  { top: "12%", left: "14%", size: "h-1.5 w-1.5", tone: "bg-brand/25", anim: "ambient-float-a", duration: "10s", delay: "0s", x: "10px", y: "-30px" },
  { top: "22%", left: "78%", size: "h-1 w-1", tone: "bg-success/25", anim: "ambient-float-b", duration: "13s", delay: "-3s", x: "-12px", y: "-24px" },
  { top: "38%", left: "8%", size: "h-2 w-2", tone: "bg-brand-200/60", anim: "ambient-float-c", duration: "15s", delay: "-1s", x: "8px", y: "-34px" },
  { top: "48%", left: "88%", size: "h-1.5 w-1.5", tone: "bg-brand/20", anim: "ambient-float-a", duration: "11s", delay: "-5s", x: "-9px", y: "-26px" },
  { top: "62%", left: "18%", size: "h-1 w-1", tone: "bg-success/20", anim: "ambient-float-b", duration: "14s", delay: "-2s", x: "11px", y: "-28px" },
  { top: "70%", left: "72%", size: "h-1.5 w-1.5", tone: "bg-brand/25", anim: "ambient-float-c", duration: "12s", delay: "-7s", x: "-7px", y: "-22px" },
  { top: "84%", left: "42%", size: "h-1 w-1", tone: "bg-brand-200/50", anim: "ambient-float-a", duration: "16s", delay: "-4s", x: "6px", y: "-36px" },
  { top: "28%", left: "48%", size: "h-1 w-1", tone: "bg-success/15", anim: "ambient-float-b", duration: "17s", delay: "-8s", x: "-8px", y: "-20px" },
];

function AmbientParticles() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={`ambient-particle absolute rounded-full ${p.size} ${p.tone}`}
          style={{
            top: p.top,
            left: p.left,
            "--drift-x": p.x,
            "--drift-y": p.y,
            animationName: p.anim,
            animationDuration: p.duration,
            animationDelay: p.delay,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </div>
  );
}

function ReceiptRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-body text-neutral-700 shrink-0">{label}</span>
      <span className="text-body text-right min-w-0">{children}</span>
    </div>
  );
}

function WalletIcon() {
  return (
    <svg
      width="28"
      height="28"
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
      <path
        d="M8 7V6.5A2.5 2.5 0 0 1 10.5 4h7A2.5 2.5 0 0 1 20 6.5V7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
