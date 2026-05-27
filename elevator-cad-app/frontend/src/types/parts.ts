export type RailBracketParameters = {
  A: number;
  B: number;
};

export type PartExportRequest = {
  parts: Array<{
    partName: "RailBracket";
    parameters: RailBracketParameters;
  }>;
};
