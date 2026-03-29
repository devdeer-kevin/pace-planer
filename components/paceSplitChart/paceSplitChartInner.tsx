import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface ChartDataPoint {
  km: number;
  elapsed: number;
  tooltip: string;
}

interface PaceSplitChartProps {
  data: ChartDataPoint[];
}

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const formatYAxis = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${pad(h)}:${pad(m)}`;
};

const formatXAxis = (km: number) => {
  if (Number.isInteger(km)) return `${km}km`;
  return `${km.toFixed(1)}km`;
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartDataPoint }[];
}) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload;
    return (
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: 4,
          padding: "4px 8px",
        }}
      >
        <p style={{ fontFamily: "monospace", fontSize: 10, color: "#fbbf24", margin: 0 }}>
          {formatXAxis(point.km)}
        </p>
        <p style={{ fontFamily: "monospace", fontSize: 10, color: "#f8fafc", margin: 0 }}>
          {point.tooltip}
        </p>
      </div>
    );
  }
  return null;
};

export default function PaceSplitChartInner({ data }: PaceSplitChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 10, left: -12, bottom: 4 }}>
        <XAxis
          dataKey="km"
          type="number"
          domain={["dataMin", "dataMax"]}
          tickFormatter={formatXAxis}
          tick={{ fill: "#64748b", fontFamily: "monospace", fontSize: 9 }}
          axisLine={{ stroke: "#1e293b" }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={formatYAxis}
          tick={{ fill: "#64748b", fontFamily: "monospace", fontSize: 9 }}
          axisLine={{ stroke: "#1e293b" }}
          tickLine={false}
          width={42}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#334155", strokeWidth: 1 }} />
        <Line
          type="monotone"
          dataKey="elapsed"
          stroke="#fbbf24"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, fill: "#fbbf24", strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
