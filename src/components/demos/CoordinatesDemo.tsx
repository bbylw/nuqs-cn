import { useState } from "react";
import { parseAsFloat, useQueryStates } from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/react";
import { DemoButton, DemoFrame, Readout } from "./DemoFrame";

const coordinateParsers = {
  lat: parseAsFloat.withDefault(45.18),
  lng: parseAsFloat.withDefault(5.72),
};

export default function CoordinatesDemo() {
  return (
    <NuqsAdapter>
      <Coordinates />
    </NuqsAdapter>
  );
}

function Coordinates() {
  const [coordinates, setCoordinates] = useQueryStates(coordinateParsers, {
    history: "replace",
  });
  const [lastBatch, setLastBatch] = useState("—");

  const random = async () => {
    const next = {
      lat: Math.round((Math.random() * 180 - 90) * 100) / 100,
      lng: Math.round((Math.random() * 360 - 180) * 100) / 100,
    };
    // 末尾返回的 Promise 解析为批量更新后的 URLSearchParams
    const search = await setCoordinates(next);
    setLastBatch(
      `?${new URLSearchParams({
        lat: String(search.get("lat")),
        lng: String(search.get("lng")),
      })}`,
    );
  };

  return (
    <DemoFrame title="useQueryStates" badge="BATCHING">
      <div className="grid gap-5">
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="lat-input" className="font-mono text-[11px] text-fog-500">
              lat
            </label>
            <span className="font-mono text-xs tabular-nums text-signal">
              {coordinates.lat.toFixed(2)}
            </span>
          </div>
          <input
            id="lat-input"
            type="range"
            min={-90}
            max={90}
            step={0.01}
            value={coordinates.lat}
            className="mt-2 h-1 w-full cursor-pointer appearance-none rounded-full bg-line accent-signal"
            onChange={(e) => setCoordinates({ lat: Number(e.target.value) })}
          />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="lng-input" className="font-mono text-[11px] text-fog-500">
              lng
            </label>
            <span className="font-mono text-xs tabular-nums text-signal">
              {coordinates.lng.toFixed(2)}
            </span>
          </div>
          <input
            id="lng-input"
            type="range"
            min={-180}
            max={180}
            step={0.01}
            value={coordinates.lng}
            className="mt-2 h-1 w-full cursor-pointer appearance-none rounded-full bg-line accent-signal"
            onChange={(e) => setCoordinates({ lng: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="mt-5">
        <DemoButton onClick={random}>随机坐标</DemoButton>
      </div>

      <div className="mt-3">
        <Readout label="状态" value={`{ lat: ${coordinates.lat}, lng: ${coordinates.lng} }`} />
        <Readout label="await setCoordinates()" value={lastBatch} tone="signal" />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-fog-500">
        同一个事件循环 tick 内的多次 setState 会被合并，一次性刷新到 URL；
        await 返回的 Promise 即可拿到更新后的 <code className="font-mono text-fog-300">URLSearchParams</code>。
      </p>
    </DemoFrame>
  );
}
