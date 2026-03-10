/**
 * @file VolumeChart.tsx
 * @description Weekly workout volume bar chart for the HomeDashboard.
 *
 * Renders a custom CSS bar chart (no external chart library) showing the
 * total volume lifted (kg) for each day of the current week. Bar heights
 * are calculated as a percentage of the week's maximum volume, so the
 * tallest bar always reaches full height regardless of scale.
 *
 * Each bar displays:
 * - A numeric volume label above the bar (hidden when volume is 0)
 * - The bar itself, animated with a CSS transition on mount
 * - The day label below the bar
 *
 * A Y-axis max label is shown in the top-right corner of the chart card.
 *
 * @module components/VolumeChart
 */

import type { VolumeChartProps } from "../types";

/**
 * VolumeChart
 *
 * Renders a weekly volume bar chart on the HomeDashboard. Each bar
 * represents one day's total lifted volume in kilograms.
 *
 * Bar heights are proportional to the week's peak volume — the day with
 * the highest volume renders at 100% height, and all others scale accordingly.
 *
 * @param {VolumeChartProps} props
 * @param {ChartData[]}      props.data - Array of `{ day, volume }` objects,
 *                                        one per day of the week. Days with
 *                                        no workout should have `volume: 0`.
 *
 * @example
 * const weekData: ChartData[] = [
 *   { day: "Mon", volume: 1200 },
 *   { day: "Tue", volume: 0 },
 *   { day: "Wed", volume: 950 },
 *   // ...
 * ];
 * <VolumeChart data={weekData} />
 */
export default function VolumeChart({ data }: VolumeChartProps) {
  /**
   * The highest volume value in the dataset, used as the 100% reference
   * for bar height calculations. A floor of 1 prevents division by zero
   * on weeks with no workouts logged.
   */
  const maxVolume = Math.max(...data.map((d) => d.volume), 1);

  return (
    <div className="w-full">
      {/* Chart section title — positioned above the card */}
      <h3 className="text-xl font-bold mb-4 text-text-primary">
        Volume This Week
      </h3>

      {/* Chart card container */}
      <div className="bg-card rounded-2xl p-4 border border-surface">
        {/* Y-axis max label — top-right corner of the chart area */}
        <div className="text-muted text-xs font-mono mb-1 text-right pr-1">
          {maxVolume}
        </div>

        {/* Bar container — flex row, bars aligned to the bottom */}
        <div className="h-40 flex items-end justify-between gap-1">
          {data.map((item) => {
            /** Height as a percentage of the max volume (0–100) */
            const heightPercentage = (item.volume / maxVolume) * 100;

            return (
              <div
                key={item.day}
                className="flex flex-col items-center flex-1 gap-1.5 h-full justify-end"
              >
                {/* Volume label above the bar — empty string hides it for zero-volume days */}
                <span className="text-[11px] font-mono text-white leading-none">
                  {item.volume > 0 ? item.volume : ""}
                </span>

                {/* Bar — animates height on first render via CSS transition */}
                <div className="w-full flex justify-center h-full items-end">
                  <div
                    className="w-full max-w-[24px] bg-primary rounded-t-sm transition-all duration-700 ease-out"
                    style={{ height: `${heightPercentage}%` }}
                    aria-label={`${item.day}: ${item.volume} kg`}
                  />
                </div>

                {/* Day label below the bar */}
                <span className="text-muted text-[11px]">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
