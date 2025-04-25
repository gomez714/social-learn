import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo( userId: string, initialtState: FollowerInfo) {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () => kyInstance.get(`/api/users/${userId}/followers`).json<FollowerInfo>(),
    initialData: initialtState,
    staleTime: Infinity,
  })

  return query;
}