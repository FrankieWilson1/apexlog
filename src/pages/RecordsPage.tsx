/**
 * @file RecordsPage.tsx
 * @description All-time personal records page for Apexlog.
 *
 * Fetches all PRs from GET /api/prs and displays them in a
 * searchable list. Each row shows the exercise name, best weight,
 * best reps, volume, and date it was set.
 *
 * @module pages/RecordsPage
 */

import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import apiFetch from "../config/apiHelper";
import LoadingScreen from "../components/LoadingScreen";
import type { PR } from "../types";

export default function RecordsPage() {
  const { token, user } = useAuth();
  const weightUnit = user?.weightUnit || "kg";

  const [prs, setPRs] = useState<PR[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPRs = async () => {
      try {
        const data = await apiFetch("/prs", token);
        setPRs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPRs();
  }, [token]);

  const filtered = prs.filter((pr) =>
    pr.exerciseName.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) return <LoadingScreen message="Loading your records..." />;

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="px-4 pt-6 pb-32 mx-auto max-w-lg lg:px-8 lg:pt-28 lg:pb-16">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-1">
            Personal Records
          </h1>
          <p className="text-muted text-sm">
            Your all-time bests across every exercise.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search exercises.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-surface rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Empty state */}
        {prs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-text-primary font-bold text-lg mb-2">
              No records yet
            </h3>
            <p className="text-muted text-sm">
              Complete your first workout to start tracking personal records.
            </p>
          </div>
        )}

        {/* No search results */}
        {prs.length > 0 && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted text-sm">
              No records found for "{search}"
            </p>
          </div>
        )}

        {/* PR list */}
        {filtered.length > 0 && (
          <div className="bg-card/40 rounded-2xl border border-surface divide-y divide-surface">
            {filtered.map((pr) => (
              <div key={pr._id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-text-primary font-semibold text-sm truncate">
                      {pr.exerciseName}
                    </p>
                    <p className="text-muted text-xs mt-0.5">{pr.date}</p>
                  </div>

                  {/* PR stats */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-text-primary font-bold text-sm">
                        {pr.weight}
                        {weightUnit} x {pr.reps}
                      </p>
                      <p className="text-muted text-xs">
                        {pr.volume.toLocaleString()}
                        {weightUnit} vol
                      </p>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: "rgba(251,191,36,0.12)",
                        color: "#FBB124",
                      }}
                    >
                      PR
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Count */}
        {prs.length > 0 && (
          <p className="text-center text-muted text-xs mt-6">
            {prs.length} personal record{prs.length !== 1 ? "s" : ""} tracked
          </p>
        )}
      </div>
    </div>
  );
}
