import type { RailBracketParameters } from "../types/parts";

export type SvgLine = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  layer: "solid" | "channel" | "hidden" | "center";
};

export type SvgDimension = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  orientation: "horizontal" | "vertical";
};

export function buildRailBracketPreview(params: RailBracketParameters) {
  const left = 90;
  const right = left + params.A;
  const lines: SvgLine[] = [];
  const dimensions: SvgDimension[] = [];

  const lx = (offset: number) => left + offset;
  const rx = (offset: number) => right + offset;
  const add = (x1: number, y1: number, x2: number, y2: number, layer: SvgLine["layer"] = "solid") => {
    lines.push({ x1, y1, x2, y2, layer });
  };

  const y0 = 70;
  const y1 = y0 + 21;
  const y2 = y0 + 53;
  const y3 = y0 + params.B + 45;
  const y4 = y0 + params.B + 77;
  const y5 = y0 + params.B + 98;

  add(lx(0), y3, rx(0), y3, "channel");
  add(lx(0), y4, rx(0), y4, "channel");
  add(lx(33), y5, rx(-33), y5);
  add(lx(0), y2, rx(0), y2, "channel");
  add(lx(0), y1, rx(0), y1, "channel");
  add(lx(33), y0, rx(-33), y0);
  add(lx(0), y4, lx(0), y3);
  add(lx(0), y2, lx(0), y1);
  add(rx(0), y4, rx(0), y3);
  add(rx(0), y2, rx(0), y1);
  add(lx(33), y5, lx(33), y4);
  add(lx(33), y4, lx(0), y4);
  add(lx(33), y0, lx(33), y1);
  add(lx(33), y1, lx(0), y1);
  add(rx(-33), y0, rx(-33), y1);
  add(rx(-33), y1, rx(0), y1);
  add(rx(-33), y5, rx(-33), y4);
  add(rx(-33), y4, rx(0), y4);
  add(lx(0), y3, lx(-4), y3);
  add(lx(-4), y3, lx(-4), y2);
  add(lx(-4), y2, lx(0), y2);
  add(rx(0), y3, rx(4), y3);
  add(rx(4), y3, rx(4), y2);
  add(rx(4), y2, rx(0), y2);
  dimensions.push({ x1: lx(0), y1: y1 - 54, x2: rx(0), y2: y1 - 54, label: "A", orientation: "horizontal" });
  dimensions.push({ x1: lx(-52), y1: y2, x2: lx(-52), y2: y3, label: "B-8", orientation: "vertical" });
  dimensions.push({ x1: rx(58), y1: y0, x2: rx(58), y2: y5, label: "B+98", orientation: "vertical" });

  const z0 = 365;
  const z1 = z0 + 4;
  const z2 = z0 + 24;
  const z3 = z0 + 35;
  const z4 = z0 + 85;
  const z5 = z0 + params.B - 24;
  const z6 = z0 + params.B - 4;
  const z7 = z0 + params.B;

  add(lx(0), z0, rx(0), z0);
  add(lx(33), z2, rx(-33), z2);
  add(lx(0), z1, rx(0), z1, "hidden");
  add(lx(0), z7, rx(0), z7);
  add(lx(33), z5, rx(-33), z5);
  add(lx(0), z6, rx(0), z6, "hidden");
  add(rx(30), z4, rx(-32), z4, "center");
  add(rx(30), z3, rx(-32), z3, "center");
  add(lx(5), z6, lx(5), z1);
  add(rx(-5), z6, rx(-5), z1);
  add(rx(0), z7, rx(0), z0);
  add(lx(0), z7, lx(0), z0);
  add(lx(31), z4, lx(-32), z4, "center");
  add(lx(31), z3, lx(-32), z3, "center");
  add(lx(33), z6, lx(0), z6);
  add(lx(33), z1, lx(0), z1);
  add(rx(-33), z1, rx(0), z1);
  add(rx(-33), z5, rx(-33), z6);
  add(rx(-33), z6, rx(0), z6);
  add(rx(-33), z2, rx(-33), z1);
  add(lx(33), z5, lx(33), z6);
  add(lx(33), z2, lx(33), z1);
  dimensions.push({ x1: lx(0), y1: z0 - 52, x2: rx(0), y2: z0 - 52, label: "A", orientation: "horizontal" });
  dimensions.push({ x1: lx(-48), y1: z0, x2: lx(-48), y2: z7, label: "B", orientation: "vertical" });

  const t0 = 650;
  const t1 = t0 + 4;
  const t2 = t0 + 36;
  const t3 = t0 + 40;
  add(rx(4), t3, lx(-4), t3);
  add(rx(0), t2, lx(0), t2, "hidden");
  add(rx(-33), t0, lx(33), t0);
  add(rx(0), t1, lx(0), t1, "hidden");
  add(lx(0), t2, lx(0), t1);
  add(rx(0), t2, rx(0), t1);
  add(rx(0), t1, rx(-33), t1);
  add(rx(-33), t1, rx(-33), t0);
  add(lx(0), t1, lx(33), t1);
  add(lx(33), t1, lx(33), t0);
  add(lx(-4), t3, lx(0), t2);
  add(rx(0), t2, rx(4), t3);
  add(lx(5), t2, lx(5), t1, "channel");
  add(rx(-5), t2, rx(-5), t1, "channel");
  dimensions.push({ x1: lx(0), y1: t0 - 58, x2: rx(0), y2: t0 - 58, label: "A", orientation: "horizontal" });
  dimensions.push({ x1: lx(-48), y1: t0, x2: lx(-48), y2: t3, label: "40", orientation: "vertical" });

  return {
    lines,
    dimensions,
    viewBox: `0 0 ${params.A + 240} 760`,
  };
}
