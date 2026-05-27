import { buildPartPreview } from "../geometry/railBracket";
import type { PartName, PartParameters } from "../types/parts";

const strokeByLayer = {
  solid: "stroke-slate-100",
  channel: "stroke-lime-400",
  hidden: "stroke-fuchsia-500",
  center: "stroke-cyan-300",
};

const dashByLayer = {
  solid: undefined,
  channel: undefined,
  hidden: "10 7",
  center: "18 8 3 8",
};

export function RailBracketPreview({ partName, params }: { partName: PartName; params: PartParameters }) {
  const drawing = buildPartPreview(partName, params);

  return (
    <svg className="h-full min-h-[520px] w-full" viewBox={drawing.viewBox} role="img" aria-label="Rail bracket preview">
      <defs>
        <marker id="arrow" markerHeight="8" markerWidth="8" orient="auto-start-reverse" refX="4" refY="4">
          <path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" />
        </marker>
      </defs>
      <rect width="100%" height="100%" fill="#111827" />
      <g strokeLinecap="round" strokeLinejoin="round">
        {drawing.shapes.map((shape, index) => (
          <polygon
            key={`shape-${index}`}
            points={shape.points}
            fill="none"
            className={shape.layer === "hidden" ? "stroke-fuchsia-500" : "stroke-slate-100"}
            strokeWidth="2"
            strokeDasharray={shape.layer === "hidden" ? "10 7" : undefined}
          />
        ))}
        {drawing.lines.map((line, index) => (
          <line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            className={strokeByLayer[line.layer]}
            strokeWidth={line.layer === "center" ? 1.5 : 2}
            strokeDasharray={dashByLayer[line.layer]}
          />
        ))}
      </g>
      <g className="font-mono text-[18px] font-semibold">
        {drawing.dimensions.map((dimension, index) => {
          const midX = (dimension.x1 + dimension.x2) / 2;
          const midY = (dimension.y1 + dimension.y2) / 2;
          return (
            <g key={index}>
              <line
                x1={dimension.x1}
                y1={dimension.y1}
                x2={dimension.x2}
                y2={dimension.y2}
                stroke="#ef4444"
                strokeWidth="1.5"
                markerStart="url(#arrow)"
                markerEnd="url(#arrow)"
              />
              <text
                x={dimension.orientation === "horizontal" ? midX : midX - 10}
                y={dimension.orientation === "horizontal" ? midY - 8 : midY}
                fill="#ef4444"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={dimension.orientation === "vertical" ? `rotate(-90 ${midX - 10} ${midY})` : undefined}
              >
                {dimension.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
