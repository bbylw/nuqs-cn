import { useQueryState, parseAsInteger } from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/react";
import { DemoButton, DemoFrame, Readout } from "./DemoFrame";

export default function CounterDemo() {
  return (
    <NuqsAdapter>
      <Counter />
    </NuqsAdapter>
  );
}

function Counter() {
  const [count, setCount] = useQueryState(
    "counter",
    parseAsInteger.withDefault(0).withOptions({ history: "replace" }),
  );

  const serialized = parseAsInteger.serialize(count);

  return (
    <DemoFrame title="counter=0" badge="useQueryState">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] text-fog-500">count</p>
          <p className="font-display text-6xl font-bold leading-none tracking-tighter text-fog-50 tabular-nums">
            {count}
          </p>
        </div>
        <div className="flex gap-2">
          <DemoButton onClick={() => setCount((c) => c - 1)} ariaLabel="减一">
            −
          </DemoButton>
          <DemoButton onClick={() => setCount((c) => c + 1)} ariaLabel="加一">
            +
          </DemoButton>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <DemoButton onClick={() => setCount(0)}>重置</DemoButton>
        <DemoButton onClick={() => setCount(null)}>清除</DemoButton>
      </div>

      <div className="mt-3">
        <Readout
          label="序列化结果"
          value={count === 0 ? "（等于默认值，已从 URL 移除）" : `?counter=${serialized}`}
          tone="signal"
        />
        <Readout label="状态类型" value="number（永不为 null）" tone="muted" />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-fog-500">
        默认值只存在于 React 内部，<span className="text-fog-300">不会</span>被写入 URL；
        设为 <code className="font-mono text-fog-300">null</code> 会移除查询键并回落到默认值。
      </p>
    </DemoFrame>
  );
}
