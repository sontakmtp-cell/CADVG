type NumberFieldProps = {
  label: string;
  value: number;
  unit?: string;
  onChange: (value: number) => void;
};

export function NumberField({ label, value, unit = "mm", onChange }: NumberFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <div className="flex overflow-hidden rounded-md border border-slate-300 bg-white focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-100">
        <input
          className="min-w-0 flex-1 px-3 py-2 text-sm text-slate-950 outline-none"
          type="number"
          min={1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <span className="border-l border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
          {unit}
        </span>
      </div>
    </label>
  );
}
