import { cache, Suspense } from "react";
import prisma from "@/lib/prisma";
import { getPostDataInclude, UserData } from "@/lib/types";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { validateRequest } from "@/auth";
import Post from "@/components/posts/Post";
import UserTooltip from "@/components/UserTooltip";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import { Loader2 } from "lucide-react";
import Linkify from "@/components/Linkify";
import FollowButton from "@/components/FollowButton";

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findFirst({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) notFound();
  return post;
});

export async function generateMetadata({params}: { params: Promise<{ postId: string }> }): Promise<Metadata> {
  const { user } = await validateRequest();
  const { postId } = await params;
  if (!user) return {};

  const post = await getPost(postId, user.id);

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  };
}

export default async function PostPage({params}: { params: Promise<{ postId: string }> }) {
  const { user } = await validateRequest();
  const { postId } = await params;

  if (!user) {
    return (
      <p className="text-destructive">
        You must be logged in to view this page
      </p>
    );
  }

  const post = await getPost(postId, user.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
}

interface UserInfoSidebarProps {
  user: UserData;
}

async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return null;

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-md">
      <div className="text-xl font-bold">About this user</div>
      <UserTooltip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-2"
        >
          <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
          <div>
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-all text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>
      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id,
            ),
          }}
        />
      )}
    </div>
  );
}
