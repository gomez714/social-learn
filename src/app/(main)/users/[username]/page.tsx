import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import TrendsSidebar from "@/components/TrendsSidebar";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { getUserDataSelect, UserData, FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserPosts from "./UserPosts";
import Linkify from "@/components/Linkify";
import EditProfileButton from "./EditProfileButton";


interface UserPageProps {
  params: {
    username: string;
  }
}

const getUser = cache(async (username: string, loggedInUserId: string) => {

  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: 'insensitive',
      },
    },
    select: getUserDataSelect(loggedInUserId),
    
  })

  if (!user) notFound();
  return user;

})

export async function generateMetadata({params: {username}}: UserPageProps): Promise<Metadata> {
  const {user: loggedInUser} = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  }
}

export default async function UserPage({params: {username}}: UserPageProps) {

  const {user: loggedInUser} = await validateRequest();

  if (!loggedInUser) {
   return (
    <p className="text-destructive">You must be logged in to view this page</p>
   )
  }

  const user = await getUser(username, loggedInUser.id);

return (
  <main className="flex w-full min-w-0 gap-5">
    <div className="w-full min-w-0 space-y-5">
      <UserProfile user={user} loggedInUserId={loggedInUser.id} />
      <div className="rounded-2xl bg-card text-2xl font-bold">
        <h2 className="text-center text-2xl font-bold">{user.displayName}&apos;s Posts</h2>
      </div>
      <UserPosts userId={user.id} />
    </div>
    <TrendsSidebar />
  </main>
)

}


interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

function UserProfile({user, loggedInUserId}: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(({followerId}) => followerId === loggedInUserId),
  }

  return (
    <div className="h-fit w-full rounded-2xl space-y-5 bg-card p-5">
      <UserAvatar avatarUrl={user.avatarUrl} size={250} className="mx-auto size-full max-h-60 max-w-60 rounded-full" />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
          <div>Member since {formatDate(user.createdAt, 'MMM d, yyyy')}</div>
          <div className="flex gap-3 items-center">
            <span>
              Posts: {" "}
              <span className="font-bold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
          
        </div>
        {user.id === loggedInUserId ? (
          <EditProfileButton user={user} />
        ):(
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      <Linkify>
        {user.bio && (
          <div className="overflow-hidden whitespace-pre-line break-words">
            {user.bio}
          </div>
        )}
      </Linkify>

    </div>
  )
}
