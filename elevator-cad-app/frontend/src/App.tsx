import axios from "axios";
import { Download, Ruler, Settings2 } from "lucide-react";
import { useMemo, useState } from "react";

import { NumberField } from "./components/NumberField";
import { RailBracketPreview } from "./components/RailBracketPreview";
import type { PartExportRequest, RailBracketParameters } from "./types/parts";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function App() {
  const [params, setParams] = useState<RailBracketParameters>({ A: 1310, B: 120 });
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summaryRows = useMemo(
    () => [
      ["A", `${params.A} mm`],
      ["B", `${params.B} mm`],
      ["B - 8", `${params.B - 8} mm`],
      ["B + 98", `${params.B + 98} mm`],
    ],
    [params],
  );

  const updateParam = (key: keyof RailBracketParameters, value: number) => {
    setParams((current) => ({ ...current, [key]: Number.isFinite(value) ? value : 0 }));
  };

  const exportDxf = async () => {
    setIsExporting(true);
    setError(null);
    const payload: PartExportRequest = {
      parts: [{ partName: "RailBracket", parameters: params }],
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/export-dxf`, payload, { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "rail-bracket.dxf";
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
            <p className="text-xs text-slate-400">Rail bracket</p>
          </div>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-md bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isExporting}
          onClick={exportDxf}
        >
          <Download size={16} />
          {isExporting ? "Exporting..." : "Export DXF"}
        </button>
      </header>

      <div className="grid min-h-[calc(100vh-3.5rem)] grid-cols-[220px_360px_minmax(0,1fr)]">
        <aside className="border-r border-slate-800 bg-slate-900/80 p-3">
          <button className="flex w-full items-center justify-between rounded-md bg-cyan-500/10 px-3 py-2 text-left text-sm font-semibold text-cyan-100 ring-1 ring-cyan-500/30">
            <span>Rail bracket</span>
            <span className="text-xs text-cyan-300">01</span>
          </button>
        </aside>

        <section className="border-r border-slate-800 bg-slate-100 p-4 text-slate-950">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Settings2 size={18} className="text-slate-600" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Thông số chi tiết</h2>
          </div>

          <div className="grid gap-4">
            <NumberField label="A" value={params.A} onChange={(value) => updateParam("A", value)} />
            <NumberField label="B" value={params.B} onChange={(value) => updateParam("B", value)} />
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
            <RailBracketPreview params={params} />
          </div>
        </main>
      </div>
    </div>
  );
}
