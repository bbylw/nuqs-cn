import type { ReactNode } from "react";

interface DemoFrameProps {
  title: string;
  badge?: string;
  children: ReactNode;
}

export function DemoFrame({ title, badge, children }: DemoFrameProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-ink-850/90 shadow-[0_28px_70px_-30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between gap-3 border-b border-line/80 bg-gradient-to-b from-ink-800/60 to-ink-800/20 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-signal/80" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" aria-hidden="true" />
          <span className="ml-2 truncate font-mono text-[11px] text-fog-400">{title}</span>
        </div>
        {badge ? (
          <span className="shrink-0 font-mono text-[10px] tracking-widest text-signal-dim">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

interface ReadoutProps {
  label: string;
  value: string;
  tone?: "default" | "signal" | "muted";
}

export function Readout({ label, value, tone = "default" }: ReadoutProps) {
  const toneClass =
    tone === "signal"
      ? "text-signal"
      : tone === "muted"
        ? "text-fog-500"
        : "text-fog-100";
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-line-soft py-2 font-mono text-xs">
      <span className="shrink-0 text-fog-500">{label}</span>
      <span className={`truncate text-right ${toneClass}`}>{value}</span>
    </div>
  );
}

const buttonBase =
  "shrink-0 whitespace-nowrap rounded border border-line bg-ink-800/60 px-3 py-1.5 font-mono text-xs text-fog-200 transition-all duration-150 hover:border-signal/50 hover:text-signal active:scale-[0.97]";

export function DemoButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: ReactNode;
  onClick: () => void;
  ariaLabel?: string;
}) {
  return (
    <button type="button" className={buttonBase} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export const inputBase =
  "w-full rounded border border-line bg-ink-900 px-3 py-2 font-mono text-sm text-fog-50 placeholder:text-fog-500 transition-colors duration-150 focus:border-signal/60";
