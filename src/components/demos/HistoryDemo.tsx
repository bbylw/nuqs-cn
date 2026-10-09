import { useQueryState, parseAsInteger } from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/react";
import { DemoButton, DemoFrame, Readout } from "./DemoFrame";

export default function HistoryDemo() {
  return (
    <NuqsAdapter>
      <History />
    </NuqsAdapter>
  );
}

function History() {
  const [step, setStep] = useQueryState(
    "step",
    parseAsInteger.withDefault(0).withOptions({ history: "push" }),
  );

  return (
    <DemoFrame title="history: 'push'" badge="TRY BACK BUTTON">
      <div className="flex items-center gap-4">
        <DemoButton onClick={() => setStep((s) => s - 1)} ariaLabel="上一步">
          ←
        </DemoButton>
        <span className="font-display text-4xl font-bold tabular-nums text-fog-50">{step}</span>
        <DemoButton onClick={() => setStep((s) => s + 1)} ariaLabel="下一步">
          →
        </DemoButton>
      </div>

      <div className="mt-3">
        <Readout label="URL" value={step === 0 ? "（无 step 参数）" : `?step=${step}`} tone="signal" />
        <Readout label="历史记录条目" value="每次变化都会 push 新条目" tone="muted" />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-fog-500">
        点几下「下一步」，然后按浏览器的<span className="text-fog-300">后退</span>按钮——
        状态会随之回退。默认的 <code className="font-mono text-fog-300">'replace'</code> 则像 git squash 一样合并进同一历史项。
      </p>
    </DemoFrame>
  );
}
