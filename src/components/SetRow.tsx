import type { SetRowProps } from "../types";

export default function SetRow({
  set,
  onUpdate,
  onToggleComplete,
}: SetRowProps) {
  return (
    <div
      className={`grid grid-cols-[40px_1fr_60px_60px_40px] gap-2 items-center py-2 transition-colors duration-300 ${set.isCompleted ? "opacity-50" : ""}`}
    >
      {/* Set Number */}
      <span className="text-white font-bold text-center">{set.setNumber}</span>

      {/* Previous Log */}
      <span className="text-muted text-sm font-mono truncate">
        {set.previousStr}
      </span>

      {/* Weight Input */}
      <input
        type="number"
        value={set.weight}
        onChange={(e) =>
          onUpdate(
            set.id,
            "weight",
            e.target.value === "" ? "" : Number(e.target.value),
          )
        }
        disabled={set.isCompleted}
        className="bg-surface text-white text-center font-bold rounded-lg h-10 w-full focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-opacity-50 appearance-none"
        placeholder="-"
      />

      {/* Reps Input */}
      <input
        type="number"
        value={set.reps}
        onChange={(e) =>
          onUpdate(
            set.id,
            "reps",
            e.target.value === "" ? "" : Number(e.target.value),
          )
        }
        disabled={set.isCompleted}
        className="bg-surface text-white text-center font-bold rounded-lg h-10 w-full focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-opacity-50 appearance-none"
        placeholder="-"
      />

      {/* Complete Checkmark Button */}
      <button
        onClick={() => onToggleComplete(set.id)}
        className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${
          set.isCompleted
            ? "bg-emerald text-white"
            : "bg-surface text-muted hover:text-white"
        }`}
      >
        {/* inline SVG for the checkmark */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
