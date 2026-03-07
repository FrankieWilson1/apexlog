import type { VolumeChartProps } from "../types";

export default function VolumeChart({ data }: VolumeChartProps) {
  const maxVolume = Math.max(...data.map((d) => d.volume), 1);

  return (
    <div className="w-full">
      {/* Title sits outside the chart box, matching Figma */}
      <h3 className="text-xl font-bold mb-4 text-text-primary">
        Volume This Week
      </h3>

      {/* Chart Card */}
      <div className="bg-card rounded-2xl p-4 border border-surface">
        {/* Y-axis max label */}
        <div className="text-muted text-xs font-mono mb-1 text-right pr-1">
          {maxVolume}
        </div>

        {/* Bars */}
        <div className="h-40 flex items-end justify-between gap-1">
          {data.map((item) => {
            const heightPercentage = (item.volume / maxVolume) * 100;

            return (
              <div
                key={item.day}
                className="flex flex-col items-center flex-1 gap-1.5 h-full justify-end"
              >
                {/* Value above bar */}
                <span className="text-[11px] font-mono text-white leading-none">
                  {item.volume > 0 ? item.volume : ""}
                </span>

                {/* Bar */}
                <div className="w-full flex justify-center h-full items-end">
                  <div
                    className="w-full max-w-[24px] bg-primary rounded-t-sm transition-all duration-700 ease-out"
                    style={{ height: `${heightPercentage}%` }}
                  />
                </div>

                {/* Day label */}
                <span className="text-muted text-[11px]">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
