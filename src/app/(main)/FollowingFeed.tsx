"use client";

import Post from "@/components/posts/Post";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
export default function FollowingFeed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["post-feed", "following"],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            "/api/posts/following",
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<PostsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <div className="text-center text-muted-foreground">
        No posts found. Follow some users to get started.
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center text-destructive">Error loading posts</div>
    );
  }

  return (
    <InfiniteScrollContainer
      onBottomReached={() =>
        hasNextPage && !isFetchingNextPage && fetchNextPage()
      }
      className="space-y-5"
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
