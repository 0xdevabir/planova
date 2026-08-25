import { Suspense } from "react";
import DestinationDetailContent from "./content";

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#05060a]">
          <div className="w-10 h-10 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      }
    >
      <DestinationDetailContent placeId={decodeURIComponent(id)} />
    </Suspense>
  );
}
