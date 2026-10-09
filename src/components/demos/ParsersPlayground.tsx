import { useState, type KeyboardEvent, type ReactNode } from "react";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsJson,
  parseAsString,
  parseAsStringEnum,
  parseAsStringLiteral,
  parseAsTimestamp,
  useQueryState,
} from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Readout } from "./DemoFrame";

const ABSENT = "（键不在 URL 中）";

type Point = { x: number; y: number };

const pointParser = parseAsJson<Point>((value) => {
  if (typeof value !== "object" || value === null) return null;
  const { x, y } = value as Record<string, unknown>;
  if (typeof x !== "number" || typeof y !== "number") return null;
  return { x, y };
});

enum Direction {
  up = "UP",
  down = "DOWN",
  left = "LEFT",
  right = "RIGHT",
}

const colorParser = parseAsStringLiteral(["red", "green", "blue"] as const).withDefault("red");

const colors = ["red", "green", "blue"] as const;

const colorHex: Record<(typeof colors)[number], string> = {
  red: "#e5484d",
  green: "#788c5d",
  blue: "#6a9bcc",
};

function ParserPanel({
  code,
  raw,
  state,
  children,
}: {
  code: string;
  raw: string;
  state: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line-soft bg-ink-900/40 p-4 sm:p-5">
      <p className="font-mono text-[11px] leading-relaxed text-fog-500">{code}</p>
      <div className="mt-4 max-w-xl">{children}</div>
      <div className="mt-4 max-w-xl">
        <Readout label="序列化 → URL" value={raw} tone="signal" />
        <Readout label="React 状态值" value={state} />
      </div>
    </div>
  );
}

const chipClass =
  "rounded border border-line bg-ink-800/60 px-2.5 py-1 font-mono text-xs text-fog-200 transition-all duration-150 hover:border-signal/50 hover:text-signal active:scale-[0.97] data-[on=true]:border-signal/60 data-[on=true]:bg-signal/10 data-[on=true]:text-signal";

/* ---------------- 各解析器面板 ---------------- */

function StringPanel() {
  const [value, setValue] = useQueryState("q", parseAsString.withOptions({ history: "replace" }));
  return (
    <ParserPanel
      code="useQueryState('q', parseAsString)"
      raw={value === null ? ABSENT : `?q=${parseAsString.serialize(value)}`}
      state={value === null ? "null" : JSON.stringify(value)}
    >
      <input
        aria-label="字符串参数"
        className="w-full rounded border border-line bg-ink-900 px-3 py-2 font-mono text-sm text-fog-50 placeholder:text-fog-500 focus:border-signal/60 focus:outline-none"
        value={value ?? ""}
        placeholder="输入任意文本…"
        onChange={(e) => setValue(e.target.value)}
      />
    </ParserPanel>
  );
}

function IntegerPanel() {
  const [value, setValue] = useQueryState("count", parseAsInteger.withDefault(0).withOptions({ history: "replace" }));
  return (
    <ParserPanel
      code="useQueryState('count', parseAsInteger.withDefault(0))"
      raw={value === 0 ? "（等于默认值，已从 URL 移除）" : `?count=${parseAsInteger.serialize(value)}`}
      state={`number → ${value}`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className={chipClass}
          onClick={() => setValue((c) => c - 1)}
          aria-label="减一"
        >
          −
        </button>
        <span className="font-display text-3xl font-bold tabular-nums text-fog-50">{value}</span>
        <button
          type="button"
          className={chipClass}
          onClick={() => setValue((c) => c + 1)}
          aria-label="加一"
        >
          +
        </button>
      </div>
    </ParserPanel>
  );
}

function FloatPanel() {
  const [value, setValue] = useQueryState("brightness", parseAsFloat.withDefault(0.5).withOptions({ history: "replace" }));
  return (
    <ParserPanel
      code="useQueryState('brightness', parseAsFloat.withDefault(0.5))"
      raw={
        value === 0.5
          ? "（等于默认值，已从 URL 移除）"
          : `?brightness=${parseAsFloat.serialize(value)}`
      }
      state={`number → ${value}`}
    >
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value}
          aria-label="亮度"
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-line accent-signal"
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <span className="font-mono text-sm tabular-nums text-signal">{value.toFixed(2)}</span>
      </div>
    </ParserPanel>
  );
}

function BooleanPanel() {
  const [value, setValue] = useQueryState("darkMode", parseAsBoolean.withDefault(false).withOptions({ history: "replace" }));
  return (
    <ParserPanel
      code="useQueryState('darkMode', parseAsBoolean.withDefault(false))"
      raw={
        value === false
          ? "（等于默认值，已从 URL 移除）"
          : `?darkMode=${parseAsBoolean.serialize(value)}`
      }
      state={`boolean → ${String(value)}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={value}
        data-on={value}
        onClick={() => setValue(!value)}
        className="flex items-center gap-3"
      >
        <span
          className={`relative h-6 w-11 rounded-full border transition-colors duration-200 ${
            value ? "border-signal/60 bg-signal/20" : "border-line bg-ink-800"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4.5 w-4.5 rounded-full transition-all duration-200 ${
              value ? "left-[1.55rem] bg-signal" : "left-0.5 bg-fog-500"
            }`}
          />
        </span>
        <span className="font-mono text-xs text-fog-300">{value ? "true" : "false"}</span>
      </button>
    </ParserPanel>
  );
}

function toLocalInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

const dateInputClass =
  "w-full rounded border border-line bg-ink-900 px-3 py-2 font-mono text-sm text-fog-50 focus:border-signal/60 focus:outline-none";

function IsoDateTimePanel() {
  const [value, setValue] = useQueryState("date", parseAsIsoDateTime.withOptions({ history: "replace" }));
  return (
    <ParserPanel
      code="useQueryState('date', parseAsIsoDateTime)"
      raw={value === null ? ABSENT : `?date=${parseAsIsoDateTime.serialize(value)}`}
      state={value === null ? "null" : `Date → ${value.toISOString()}`}
    >
      <input
        type="datetime-local"
        aria-label="ISO 日期时间"
        className={dateInputClass}
        value={value ? toLocalInput(value) : ""}
        onChange={(e) => {
          const next = e.target.value ? new Date(e.target.value) : null;
          setValue(next && !Number.isNaN(next.getTime()) ? next : null);
        }}
      />
    </ParserPanel>
  );
}

function TimestampPanel() {
  const [value, setValue] = useQueryState("after", parseAsTimestamp.withOptions({ history: "replace" }));
  return (
    <ParserPanel
      code="useQueryState('after', parseAsTimestamp)"
      raw={value === null ? ABSENT : `?after=${parseAsTimestamp.serialize(value)}`}
      state={value === null ? "null" : `Date → unix ${value.getTime()}`}
    >
      <input
        type="datetime-local"
        aria-label="时间戳日期时间"
        className={dateInputClass}
        value={value ? toLocalInput(value) : ""}
        onChange={(e) => {
          const next = e.target.value ? new Date(e.target.value) : null;
          setValue(next && !Number.isNaN(next.getTime()) ? next : null);
        }}
      />
    </ParserPanel>
  );
}

function ArrayPanel() {
  const [value, setValue] = useQueryState("ids", parseAsArrayOf(parseAsInteger).withOptions({ history: "replace" }));
  const items = value ?? [];
  return (
    <ParserPanel
      code="useQueryState('ids', parseAsArrayOf(parseAsInteger))"
      raw={value === null || value.length === 0 ? ABSENT : `?ids=${value.join(",")}`}
      state={value === null ? "null" : `number[] → [${value.join(", ")}]`}
    >
      <div className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-1.5 rounded border border-signal/40 bg-signal/10 px-2 py-1 font-mono text-xs text-signal"
          >
            {item}
            <button
              type="button"
              aria-label={`移除 ${item}`}
              className="text-fog-400 hover:text-fog-50"
              onClick={() => setValue(items.filter((_, i) => i !== index))}
            >
              ×
            </button>
          </span>
        ))}
        <button
          type="button"
          className={chipClass}
          onClick={() => setValue([...items, Math.floor(Math.random() * 90) + 10])}
        >
          + 追加整数
        </button>
      </div>
    </ParserPanel>
  );
}

function JsonPanel() {
  const [value, setValue] = useQueryState("point", pointParser.withOptions({ history: "replace" }));
  const point = value ?? { x: 0, y: 0 };
  return (
    <ParserPanel
      code="useQueryState('point', parseAsJson<Point>(pointSchema))"
      raw={value === null ? ABSENT : `?point=${pointParser.serialize(value)}`}
      state={value === null ? "null" : `Point → ${JSON.stringify(value)}`}
    >
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 font-mono text-xs text-fog-400">
          x
          <input
            type="number"
            className="w-20 rounded border border-line bg-ink-900 px-2 py-1.5 font-mono text-sm text-fog-50 focus:border-signal/60 focus:outline-none"
            value={point.x}
            onChange={(e) => setValue({ ...point, x: Number(e.target.value) })}
          />
        </label>
        <label className="flex items-center gap-2 font-mono text-xs text-fog-400">
          y
          <input
            type="number"
            className="w-20 rounded border border-line bg-ink-900 px-2 py-1.5 font-mono text-sm text-fog-50 focus:border-signal/60 focus:outline-none"
            value={point.y}
            onChange={(e) => setValue({ ...point, y: Number(e.target.value) })}
          />
        </label>
      </div>
    </ParserPanel>
  );
}

function EnumPanel() {
  const [value, setValue] = useQueryState(
    "direction",
    parseAsStringEnum<Direction>(Object.values(Direction)).withOptions({
      history: "replace",
    }),
  );
  return (
    <ParserPanel
      code="useQueryState('direction', parseAsStringEnum<Direction>(Object.values(Direction)))"
      raw={value === null ? ABSENT : `?direction=${value}`}
      state={value === null ? "null" : `Direction → ${value}`}
    >
      <div className="flex flex-wrap gap-2">
        {Object.values(Direction).map((option) => (
          <button
            key={option}
            type="button"
            className={chipClass}
            data-on={value === option}
            onClick={() => setValue(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </ParserPanel>
  );
}

function LiteralPanel() {
  const [value, setValue] = useQueryState("color", colorParser.withOptions({ history: "replace" }));
  return (
    <ParserPanel
      code="useQueryState('color', parseAsStringLiteral(colors).withDefault('red'))"
      raw={value === "red" ? "（等于默认值，已从 URL 移除）" : `?color=${value}`}
      state={`'red' | 'green' | 'blue' → ${JSON.stringify(value)}`}
    >
      <div className="flex gap-2">
        {colors.map((option) => (
          <button
            key={option}
            type="button"
            className={chipClass}
            data-on={value === option}
            onClick={() => setValue(option)}
          >
            <span
              className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle"
              style={{ backgroundColor: colorHex[option] }}
            />
            {option}
          </button>
        ))}
      </div>
    </ParserPanel>
  );
}

/* ---------------- 标签页外壳 ---------------- */

const TABS: Array<{ id: string; label: string; panel: () => ReactNode }> = [
  { id: "string", label: "parseAsString", panel: StringPanel },
  { id: "integer", label: "parseAsInteger", panel: IntegerPanel },
  { id: "float", label: "parseAsFloat", panel: FloatPanel },
  { id: "boolean", label: "parseAsBoolean", panel: BooleanPanel },
  { id: "iso", label: "parseAsIsoDateTime", panel: IsoDateTimePanel },
  { id: "timestamp", label: "parseAsTimestamp", panel: TimestampPanel },
  { id: "array", label: "parseAsArrayOf", panel: ArrayPanel },
  { id: "json", label: "parseAsJson", panel: JsonPanel },
  { id: "enum", label: "parseAsStringEnum", panel: EnumPanel },
  { id: "literal", label: "parseAsStringLiteral", panel: LiteralPanel },
];

export default function ParsersPlayground() {
  const [activeId, setActiveId] = useState("string");
  const active = TABS.find((t) => t.id === activeId) ?? TABS[0]!;
  const ActivePanel = active.panel;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = TABS.findIndex((t) => t.id === activeId);
    let next: number;
    switch (event.key) {
      case "ArrowLeft":
        next = (index - 1 + TABS.length) % TABS.length;
        break;
      case "ArrowRight":
        next = (index + 1) % TABS.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = TABS.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const tab = TABS[next]!;
    setActiveId(tab.id);
    document.getElementById(`parser-tab-${tab.id}`)?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="解析器列表"
        onKeyDown={onKeyDown}
        className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`parser-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={tab.id === activeId}
            aria-controls={`parser-panel-${tab.id}`}
            tabIndex={tab.id === activeId ? 0 : -1}
            data-on={tab.id === activeId}
            onClick={() => setActiveId(tab.id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 font-mono text-[11px] transition-all duration-150 ${
              tab.id === activeId
                ? "border-signal/50 bg-signal/10 text-signal"
                : "border-line bg-ink-850/60 text-fog-400 hover:border-fog-500/40 hover:text-fog-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        id={`parser-panel-${activeId}`}
        role="tabpanel"
        aria-labelledby={`parser-tab-${activeId}`}
        tabIndex={0}
        className="mt-3"
      >
        <ActivePanel />
      </div>
    </div>
  );
}

export function ParsersPlaygroundIsland() {
  return (
    <NuqsAdapter>
      <ParsersPlayground />
    </NuqsAdapter>
  );
}
