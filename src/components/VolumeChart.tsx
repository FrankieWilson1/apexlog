import type { VolumeChartProps } from "../types";

export default function VolumeChart({ data }: VolumeChartProps) {
  const maxVolume = Math.max(...data.map((d) => d.volume), 1);

  return (
    <div className="bg-card p-5 rounded-2xl w-full mb-8 border border-surface">
      <h3 className="text-lg font-bold mb-6 text-text-primary">
        Volume This Week
      </h3>

      {/* The Chart Canvas */}
      <div className="h-48 flex items-end justify-between gap-2">
        {/* 2. Map over the 7 days */}
        {data.map((item) => {
          // Calculate the height percentage
          const heightPercentage = (item.volume / maxVolume) * 100;

          return (
            <div
              key={item.day}
              className="flex flex-col items-center flex-1 gap-2 h-full justify-end"
            >
              <span className="text-[10px] font-mono text-white">
                {item.volume > 0 ? `${(item.volume / 1000).toFixed(1)}k` : ""}
              </span>

              {/* The Bar */}
              <div className="w-full flex justify-center h-full items-end">
                <div
                  className="w-full max-w-[20px] bg-primary rounded-t-md transition-all duration-700 ease-out"
                  style={{ height: `${heightPercentage}%` }}
                ></div>
              </div>

              {/* The Day Label (Sun, Mon, Tue...) */}
              <span className="text-muted text-xs">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
