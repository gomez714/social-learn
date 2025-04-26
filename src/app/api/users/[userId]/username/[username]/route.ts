import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";

export async function GET(req: Request, {params: {username}}: {params: {username: string}}) {

  try {
    const {user: loggedInUser} = await validateRequest();
    if (!loggedInUser) {
      return new Response("Unauthorized", {status: 401});
    }

    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive"
        }
      },
      select: getUserDataSelect(loggedInUser.id)
    })

    if (!user) {
      return new Response("User not found", {status: 404});
    }
    
    return Response.json(user);
    
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", {status: 500});
  }

}