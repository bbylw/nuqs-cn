import { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/react";
import { DemoButton, DemoFrame, Readout, inputBase } from "./DemoFrame";

export default function UrlBarDemo() {
  return (
    <NuqsAdapter>
      <HeroUrlDemo />
    </NuqsAdapter>
  );
}

function HeroUrlDemo() {
  const [name, setName] = useQueryState("name", { history: "replace" });
  const [query, setQuery] = useState("");

  // 同步展示真实地址栏（含页面上其它演示写入的参数）
  useEffect(() => {
    const sync = () => setQuery(window.location.search);
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const clear = async () => {
    const search = await setName(null);
    setQuery(search.toString() ? `?${search.toString()}` : "");
  };

  const stateValue = name === null ? "null" : JSON.stringify(name);

  return (
    <DemoFrame title="nuqs.dev" badge="LIVE">
      {/* 模拟浏览器地址栏 */}
      <div className="flex items-center gap-2 rounded-lg border border-line bg-ink-900 px-3 py-2.5">
        <svg
          viewBox="0 0 14 14"
          className="h-3.5 w-3.5 shrink-0 fill-none stroke-signal-dim"
          strokeWidth="1.4"
          aria-hidden="true"
        >
          <rect x="2.5" y="6" width="9" height="6.5" rx="1.2" />
          <path d="M4.8 6V4.2a2.2 2.2 0 0 1 4.4 0V6" strokeLinecap="round" />
        </svg>
        <span className="shrink-0 font-mono text-xs text-fog-500">https://nuqs.dev</span>
        <span className="truncate font-mono text-xs text-signal">{query || "?name="}</span>
        <span className="caret ml-0.5 shrink-0" aria-hidden="true" />
      </div>

      <div className="mt-4 flex gap-2">
        <label className="sr-only" htmlFor="hero-name">
          搜索参数 name
        </label>
        <input
          id="hero-name"
          className={`${inputBase} min-w-0`}
          value={name ?? ""}
          placeholder="输入名字…"
          onChange={(e) => setName(e.target.value)}
        />
        <DemoButton onClick={clear}>清除</DemoButton>
      </div>

      <div className="mt-3">
        <Readout label="useQueryState('name')" value={stateValue} tone="signal" />
        <Readout label="URL 查询字符串" value={query || "—"} tone="muted" />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-fog-500">
        这不是截图——输入框绑定的正是当前页面的真实地址栏，改写它的就是 nuqs。
      </p>
    </DemoFrame>
  );
}
