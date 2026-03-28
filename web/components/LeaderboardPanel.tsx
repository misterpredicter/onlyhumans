"use client";

import { useEffect, useState } from "react";

interface WorkerEntry {
  rank: number;
  label: string;
  total_earned: number;
  total_votes: number;
  scored_votes: number;
  correct_votes: number;
  accuracy: number | null;
}

interface IdeaContributorEntry {
  rank: number;
  label: string;
  task_count: number;
  votes_generated: number;
  revenue_generated: number;
  idea_earnings: number;
  avg_take_rate: number;
}

interface LeaderboardData {
  workers: WorkerEntry[];
  idea_contributors: IdeaContributorEntry[];
}

interface LeaderboardPanelProps {
  title?: string;
  limit?: number;
}

const dm: React.CSSProperties = { fontFamily: "var(--font-sans), sans-serif" };

function formatUsd(value: number) {
  if (value < 0.01 && value > 0) return `$${value.toFixed(3)}`;
  return `$${value.toFixed(2)}`;
}

export function LeaderboardPanel({
  title = "Leaderboard",
  limit = 5,
}: LeaderboardPanelProps) {
  const [data, setData] = useState<LeaderboardData | null>(null);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch(() => {
        setData({ workers: [], idea_contributors: [] });
      });
  }, []);

  const workers = data?.workers.slice(0, limit) ?? [];
  const ideaContributors = data?.idea_contributors.slice(0, limit) ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <p
          style={{
            ...dm,
            fontSize: "15px",
            fontWeight: 800,
            color: "#0C0C0C",
            margin: 0,
            letterSpacing: "-0.3px",
          }}
        >
          {title}
        </p>
        <p style={{ ...dm, fontSize: "13px", color: "#6B7280", margin: "4px 0 0", lineHeight: 1.5 }}>
          Top workers compound earnings with accuracy. Top idea contributors compound volume with fair pricing.
        </p>
      </div>

      <div className="docs-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8E5DE",
            borderRadius: "18px",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px 18px", borderBottom: "1px solid #F0EDE6", backgroundColor: "#FAFAF8" }}>
            <p style={{ ...dm, fontSize: "13px", fontWeight: 800, color: "#0C0C0C", margin: 0 }}>Top workers</p>
            <p style={{ ...dm, fontSize: "12px", color: "#6B7280", margin: "4px 0 0" }}>Earnings + consensus accuracy</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {data === null &&
              Array.from({ length: limit }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    padding: "16px 18px",
                    borderBottom: index < limit - 1 ? "1px solid #F7F5F1" : "none",
                  }}
                >
                  <div className="skeleton" style={{ height: "14px", width: "100%" }} />
                </div>
              ))}

            {data !== null && workers.length === 0 && (
              <div style={{ padding: "18px", ...dm, fontSize: "13px", color: "#9CA3AF" }}>
                No worker earnings yet.
              </div>
            )}

            {workers.map((worker, index) => (
              <div
                key={worker.rank}
                style={{
                  padding: "16px 18px",
                  borderBottom: index < workers.length - 1 ? "1px solid #F7F5F1" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "999px",
                      backgroundColor: "#F0FDF4",
                      color: "#059669",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {worker.rank}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C", margin: 0 }}>
                      {worker.label}
                    </p>
                    <p style={{ ...dm, fontSize: "12px", color: "#6B7280", margin: "4px 0 0" }}>
                      {worker.accuracy === null
                        ? `${worker.total_votes} votes`
                        : `${worker.accuracy.toFixed(1)}% accuracy over ${worker.scored_votes} scored votes`}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ ...dm, fontSize: "14px", fontWeight: 800, color: "#059669", margin: 0 }}>
                    {formatUsd(worker.total_earned)}
                  </p>
                  <p style={{ ...dm, fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0" }}>earned</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8E5DE",
            borderRadius: "18px",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px 18px", borderBottom: "1px solid #F0EDE6", backgroundColor: "#FAFAF8" }}>
            <p style={{ ...dm, fontSize: "13px", fontWeight: 800, color: "#0C0C0C", margin: 0 }}>Top idea contributors</p>
            <p style={{ ...dm, fontSize: "12px", color: "#6B7280", margin: "4px 0 0" }}>Revenue generated for the network</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {data === null &&
              Array.from({ length: limit }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    padding: "16px 18px",
                    borderBottom: index < limit - 1 ? "1px solid #F7F5F1" : "none",
                  }}
                >
                  <div className="skeleton" style={{ height: "14px", width: "100%" }} />
                </div>
              ))}

            {data !== null && ideaContributors.length === 0 && (
              <div style={{ padding: "18px", ...dm, fontSize: "13px", color: "#9CA3AF" }}>
                No task revenue yet.
              </div>
            )}

            {ideaContributors.map((ideaContributor, index) => (
              <div
                key={ideaContributor.rank}
                style={{
                  padding: "16px 18px",
                  borderBottom: index < ideaContributors.length - 1 ? "1px solid #F7F5F1" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "999px",
                      backgroundColor: "#EFF6FF",
                      color: "#2563EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {ideaContributor.rank}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C", margin: 0 }}>
                      {ideaContributor.label}
                    </p>
                    <p style={{ ...dm, fontSize: "12px", color: "#6B7280", margin: "4px 0 0" }}>
                      {ideaContributor.task_count} tasks • {ideaContributor.avg_take_rate.toFixed(1)}% avg take
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ ...dm, fontSize: "14px", fontWeight: 800, color: "#2563EB", margin: 0 }}>
                    {formatUsd(ideaContributor.revenue_generated)}
                  </p>
                  <p style={{ ...dm, fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0" }}>revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
