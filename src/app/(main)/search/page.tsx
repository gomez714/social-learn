import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";
import SearchResults from "./SearchResults";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ q: string }>;
}): Promise<Metadata> {
  const { q } = await params;
  return {
    title: `Search results for "${q}"`,
  };
}

export default async function SearchPage({
  params,
}: {
  params: Promise<{ q: string }>;
}) {
  const { q } = await params;
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-md">
          <h1 className="line-clamp-2 break-all text-center text-2xl font-bold">
            Search results for &quot;{q}&quot;
          </h1>
        </div>
        <SearchResults query={q} />
      </div>
      <TrendsSidebar />
    </main>
  );
}
