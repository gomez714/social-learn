"use client";

import Post from "@/components/posts/Post";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "search", query],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/search",
          {
            searchParams: {
              q:query,
              ...(pageParam ? { cursor: pageParam } : {})
            }
          }
        ).json<PostsPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        gcTime: 0,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) { 
    return (
      <div className="text-center text-muted-foreground">
        No results found.
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="text-center text-destructive">Error loading search results</div>
    );
  }

  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
      className="space-y-5"
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
