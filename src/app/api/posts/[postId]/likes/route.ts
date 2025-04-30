import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { LikeInfo } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    const { postId } = await params;
    if (!loggedInUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        likes: {
          where: {
            userId: loggedInUser.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    const data: LikeInfo = {
      likes: post._count.likes,
      isLikedByUser: !!post.likes.length,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    const { postId } = await params;
    if (!loggedInUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        userId: true,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    await prisma.$transaction([
      prisma.like.upsert({
        where: {
          userId_postId: {
            userId: loggedInUser.id,
            postId,
          },
        },
        create: {
          userId: loggedInUser.id,
          postId,
        },
        update: {},
      }),
      ...(post.userId !== loggedInUser.id
        ? [
            prisma.notification.create({
              data: {
                recipientId: post.userId,
                issuerId: loggedInUser.id,
                postId,
                type: "LIKE",
              },
            }),
          ]
        : []),
    ]);

    return new Response();
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    const { postId } = await params;
    if (!loggedInUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        userId: true,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    await prisma.$transaction([
      prisma.like.deleteMany({
        where: {
          userId: loggedInUser.id,
          postId,
        },
      }),

      prisma.notification.deleteMany({
        where: {
          recipientId: post.userId,
          issuerId: loggedInUser.id,
          postId,
          type: "LIKE",
        },
      }),
    ]);

    return new Response();
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
