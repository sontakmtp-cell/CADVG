import axios from "axios";
import { Download, Ruler, Settings2 } from "lucide-react";
import { useMemo, useState } from "react";

import { NumberField } from "./components/NumberField";
import { RailBracketPreview } from "./components/RailBracketPreview";
import type { PartExportRequest, PartName, PartParameters, PartState } from "./types/parts";

const API_BASE_URL = "http://127.0.0.1:8000";

const INITIAL_PARTS: PartState[] = [
  {
    partName: "RailBracket",
    label: "Rail bracket",
  },
  {
    partName: "DoorStartBrace",
    label: "Thanh giằng bắt đầu cửa",
  },
  {
    partName: "DoorSillBrace",
    label: "Thanh giằng bắt shill cửa",
  },
];

const parameterKeys: Record<PartName, Array<keyof PartParameters>> = {
  RailBracket: ["A", "B"],
  DoorStartBrace: ["A", "B"],
  DoorSillBrace: ["A", "B", "C"],
};

const format = (value: number) => `${Number.isInteger(value) ? value : Number(value.toFixed(3))} mm`;

function getSummaryRows(partName: PartName, params: PartParameters) {
  const common = [
    ["A", format(params.A)],
    ["B", format(params.B)],
    ["B - 8", format(params.B - 8)],
    ["B + 98", format(params.B + 98)],
  ];

  if (partName === "RailBracket") {
    return [...common, ["4", "4 mm"], ["21", "21 mm"], ["40", "40 mm"]];
  }

  if (partName === "DoorStartBrace") {
    return [...common, ["A + 8", format(params.A + 8)], ["65", "65 mm"], ["200", "200 mm"], ["40", "40 mm"]];
  }

  return [
    ...common,
    ["A + 8", format(params.A + 8)],
    ["C", format(params.C ?? 325)],
    ["150", "150 mm"],
  ];
}

export default function App() {
  const [sharedParams, setSharedParams] = useState<PartParameters>({ A: 1310, B: 120, C: 325 });
  const [activePartName, setActivePartName] = useState<PartName>("RailBracket");
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activePart = INITIAL_PARTS.find((part) => part.partName === activePartName) ?? INITIAL_PARTS[0];
  const summaryRows = useMemo(
    () => getSummaryRows(activePart.partName, sharedParams),
    [activePart.partName, sharedParams],
  );

  const updateParam = (key: keyof PartParameters, value: number) => {
    setSharedParams((current) => ({
      ...current,
      [key]: Number.isFinite(value) ? value : 0,
    }));
  };

  const exportDxf = async () => {
    setIsExporting(true);
    setError(null);
    const payload: PartExportRequest = {
      parts: INITIAL_PARTS.map((part) => ({ partName: part.partName, parameters: sharedParams })),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/export-dxf`, payload, { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "elevator-parts.dxf";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Không xuất được DXF. Kiểm tra backend đang chạy ở cổng 8000.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900 px-4">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-md border border-cyan-500/40 bg-cyan-500/10">
            <Ruler size={18} className="text-cyan-300" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">Elevator CAD MVP</h1>
            <p className="text-xs text-slate-400">Xuất DXF nhiều chi tiết</p>
          </div>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-md bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isExporting}
          onClick={exportDxf}
        >
          <Download size={16} />
          {isExporting ? "Đang xuất..." : "Export DXF"}
        </button>
      </header>

      <div className="grid min-h-[calc(100vh-3.5rem)] grid-cols-[260px_360px_minmax(0,1fr)]">
        <aside className="border-r border-slate-800 bg-slate-900/80 p-3">
          <div className="grid gap-2">
            {INITIAL_PARTS.map((part, index) => (
              <button
                key={part.partName}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold transition ${
                  part.partName === activePartName
                    ? "bg-cyan-500/10 text-cyan-100 ring-1 ring-cyan-500/30"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
                onClick={() => setActivePartName(part.partName)}
              >
                <span>{part.label}</span>
                <span className="text-xs text-cyan-300">{String(index + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="border-r border-slate-800 bg-slate-100 p-4 text-slate-950">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Settings2 size={18} className="text-slate-600" />
            <h2 className="text-sm font-bold uppercase text-slate-700">Thông số chi tiết</h2>
          </div>

          <div className="mb-4 rounded-md border border-slate-200 bg-white p-3">
            <div className="text-xs font-bold uppercase text-slate-500">Tên chi tiết</div>
            <div className="mt-1 text-sm font-semibold text-slate-950">{activePart.label}</div>
          </div>

          <div className="grid gap-4">
            {parameterKeys[activePart.partName].map((key) => (
              <NumberField
                key={key}
                label={key}
                value={sharedParams[key] ?? 0}
                onChange={(value) => updateParam(key, value)}
              />
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-md border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-3 py-2 text-xs font-bold uppercase text-slate-500">
              Xem trước nhanh
            </div>
            <div className="divide-y divide-slate-100">
              {summaryRows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="font-medium text-slate-600">{label}</span>
                  <span className="font-mono text-slate-950">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p> : null}
        </section>

        <main className="min-w-0 bg-slate-950 p-4">
          <div className="h-full overflow-auto rounded-md border border-slate-800 bg-slate-900 shadow-2xl">
            <RailBracketPreview partName={activePart.partName} params={sharedParams} />
          </div>
        </main>
      </div>
    </div>
  );
}
