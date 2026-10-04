import { useEffect, useState } from "react";

/**
 * BottomSheet — NovaKit Lite
 * Modal sheet anchored to the bottom. Slide + fade on open/close;
 * fade-only under prefers-reduced-motion.
 */
export default function BottomSheet({ open, onClose, children }) {
  const [mounted, setMounted] = useState(open);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true));
      });
      return () => cancelAnimationFrame(id);
    }

    setEntered(false);
    const t = window.setTimeout(() => setMounted(false), 300);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-20 overflow-hidden">
      <div
        className={
          `absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out ` +
          (entered ? "opacity-100" : "opacity-0")
        }
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={
          `absolute left-0 right-0 bottom-0 bg-white rounded-t-lg p-4 pb-6 ` +
          `transition-transform transition-opacity duration-300 ease-out ` +
          `motion-reduce:transform-none ` +
          (entered
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 motion-reduce:translate-y-0")
        }
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-300" />
        {children}
      </div>
    </div>
  );
}
