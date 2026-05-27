export type PartName = "RailBracket" | "DoorStartBrace" | "DoorSillBrace";

export type PartParameters = {
  A: number;
  B: number;
  C?: number;
};

export type PartState = {
  partName: PartName;
  label: string;
};

export type PartExportRequest = {
  parts: Array<{
    partName: PartName;
    parameters: PartParameters;
  }>;
};
