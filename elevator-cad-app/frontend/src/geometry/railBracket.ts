import type { PartName, PartParameters } from "../types/parts";

export type SvgLine = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  layer: "solid" | "channel" | "hidden" | "center";
};

export type SvgShape = {
  points: string;
  layer: "solid" | "hidden";
};

export type SvgDimension = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  orientation: "horizontal" | "vertical";
};

export type PartPreview = {
  lines: SvgLine[];
  shapes: SvgShape[];
  dimensions: SvgDimension[];
  viewBox: string;
};

const numberText = (value: number) => {
  if (Number.isInteger(value)) {
    return `${value}`;
  }
  return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
};

export function buildPartPreview(partName: PartName, params: PartParameters): PartPreview {
  if (partName === "RailBracket") {
    return buildRailBracketPreview(params);
  }
  if (partName === "DoorStartBrace") {
    return buildDoorStartBracePreview(params);
  }
  return buildDoorSillBracePreview(params);
}

function createDrawing(params: PartParameters) {
  const left = 90;
  const right = left + params.A;
  const lines: SvgLine[] = [];
  const shapes: SvgShape[] = [];
  const dimensions: SvgDimension[] = [];
  const lx = (offset: number) => left + offset;
  const rx = (offset: number) => right + offset;
  const add = (x1: number, y1: number, x2: number, y2: number, layer: SvgLine["layer"] = "solid") => {
    lines.push({ x1, y1, x2, y2, layer });
  };
  const poly = (points: Array<[number, number]>, layer: SvgShape["layer"] = "solid") => {
    shapes.push({ points: points.map(([x, y]) => `${x},${y}`).join(" "), layer });
  };
  const dim = (x1: number, y1: number, x2: number, y2: number, label: number, orientation: SvgDimension["orientation"]) => {
    dimensions.push({ x1, y1, x2, y2, label: numberText(label), orientation });
  };

  return { left, right, lines, shapes, dimensions, lx, rx, add, poly, dim };
}

function addSideView(drawing: ReturnType<typeof createDrawing>, params: PartParameters, dimXOffset = -52) {
  const { lx, rx, add, dim } = drawing;
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

  dim(lx(0), y1 - 54, rx(0), y1 - 54, params.A, "horizontal");
  dim(lx(dimXOffset), y2, lx(dimXOffset), y3, params.B - 8, "vertical");
  dim(rx(58), y0, rx(58), y5, params.B + 98, "vertical");
}

function addTopView(drawing: ReturnType<typeof createDrawing>, params: PartParameters, yBase = 650) {
  const { lx, rx, add, dim } = drawing;
  const t0 = yBase;
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
  dim(lx(0), t0 - 58, rx(0), t0 - 58, params.A + 8, "horizontal");
  dim(lx(-48), t0, lx(-48), t3, 40, "vertical");
}

function addBraceFrontView(drawing: ReturnType<typeof createDrawing>, params: PartParameters) {
  const { lx, rx, add, dim } = drawing;
  const z0 = 365;
  const z1 = z0 + 4;
  const z2 = z0 + 24;
  const z5 = z0 + params.B - 24;
  const z6 = z0 + params.B - 4;
  const z7 = z0 + params.B;

  add(lx(0), z0, rx(0), z0);
  add(lx(33), z2, rx(-33), z2);
  add(lx(0), z1, rx(0), z1, "hidden");
  add(lx(0), z7, rx(0), z7);
  add(lx(33), z5, rx(-33), z5);
  add(lx(0), z6, rx(0), z6, "hidden");
  add(lx(5), z6, lx(5), z1);
  add(rx(-5), z6, rx(-5), z1);
  add(rx(0), z7, rx(0), z0);
  add(lx(0), z7, lx(0), z0);
  add(lx(33), z5, lx(33), z6);
  add(lx(33), z6, lx(0), z6);
  add(lx(33), z2, lx(33), z1);
  add(rx(-33), z2, rx(-33), z1);
  add(rx(-33), z1, rx(0), z1);
  add(rx(-33), z6, rx(0), z6);
  add(rx(-33), z5, rx(-33), z6);
  add(lx(33), z1, lx(0), z1);

  dim(lx(0), z0 - 52, rx(0), z0 - 52, params.A, "horizontal");
  dim(lx(-48), z0, lx(-48), z7, params.B, "vertical");

  return { z0, z1, z2, z5, z6, z7 };
}

function buildRailBracketPreview(params: PartParameters): PartPreview {
  const drawing = createDrawing(params);
  const { lx, rx, add, dim } = drawing;
  addSideView(drawing, params);

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
  dim(lx(0), z0 - 52, rx(0), z0 - 52, params.A, "horizontal");
  dim(lx(-48), z0, lx(-48), z7, params.B, "vertical");
  addTopView(drawing, { ...params, A: params.A - 8 });

  return {
    lines: drawing.lines,
    shapes: drawing.shapes,
    dimensions: drawing.dimensions,
    viewBox: `0 0 ${params.A + 240} 760`,
  };
}

function buildDoorStartBracePreview(params: PartParameters): PartPreview {
  const drawing = createDrawing(params);
  const { lx, rx, poly, dim } = drawing;
  addSideView(drawing, params);
  const front = addBraceFrontView(drawing, params);
  addTopView(drawing, params);
  const mid = (drawing.left + drawing.right) / 2;

  poly([[lx(65), front.z1 + 5], [lx(265), front.z1 + 5], [lx(265), front.z6], [lx(65), front.z6]]);
  poly([[lx(82), front.z1 + 62], [lx(82), front.z1 + 50], [lx(226), front.z1 + 50], [lx(226), front.z1 + 62]]);
  poly([[mid - 2.5, front.z1 + 2], [mid + 2.5, front.z1 + 2], [mid + 2.5, front.z6], [mid - 2.5, front.z6]], "hidden");
  poly([[rx(-65), front.z1 + 5], [rx(-265), front.z1 + 5], [rx(-265), front.z6], [rx(-65), front.z6]]);
  poly([[rx(-82), front.z1 + 62], [rx(-82), front.z1 + 50], [rx(-226), front.z1 + 50], [rx(-226), front.z1 + 62]]);
  dim(lx(65), front.z0 - 50, lx(265), front.z0 - 50, 200, "horizontal");
  dim(lx(0), front.z0 - 75, lx(65), front.z0 - 75, 65, "horizontal");
  dim(rx(-265), front.z0 - 50, rx(-65), front.z0 - 50, 200, "horizontal");
  dim(rx(-65), front.z0 - 75, rx(0), front.z0 - 75, 65, "horizontal");

  return {
    lines: drawing.lines,
    shapes: drawing.shapes,
    dimensions: drawing.dimensions,
    viewBox: `0 0 ${params.A + 240} 760`,
  };
}

function buildDoorSillBracePreview(params: PartParameters): PartPreview {
  const drawing = createDrawing(params);
  const { lx, poly, dim } = drawing;
  const c = params.C ?? 325;
  addSideView(drawing, params);
  const front = addBraceFrontView(drawing, params);
  addTopView(drawing, params);

  const first = lx(255);
  const inserts = [first, first + c, first + c * 2];
  for (const insertX of inserts) {
    poly([[insertX, front.z0 + 9], [insertX + 150, front.z0 + 9], [insertX + 150, front.z0 + 116], [insertX, front.z0 + 116]]);
    dim(insertX, front.z0 - 68, insertX + 150, front.z0 - 68, 150, "horizontal");
  }
  dim(inserts[0] + 75, front.z6 + 50, inserts[1] + 75, front.z6 + 50, c, "horizontal");
  dim(inserts[1] + 75, front.z6 + 50, inserts[2] + 75, front.z6 + 50, c, "horizontal");

  return {
    lines: drawing.lines,
    shapes: drawing.shapes,
    dimensions: drawing.dimensions,
    viewBox: `0 0 ${params.A + 240} 760`,
  };
}
