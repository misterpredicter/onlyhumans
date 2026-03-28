import dynamic from "next/dynamic";

// Dynamically import to avoid SSR issues with @worldcoin/idkit
const JoinPageClient = dynamic(() => import("./JoinPageClient"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "#0C0C0C",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid rgba(255,255,255,0.1)",
          borderTopColor: "#10B981",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

export default function JoinPage() {
  return <JoinPageClient />;
}
