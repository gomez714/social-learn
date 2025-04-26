import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async ({}) => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
    
      
      const oldAvatarUrl = metadata.user.avatarUrl;


      if (oldAvatarUrl) {
        const parts = oldAvatarUrl.split("/f/");
        const key = parts[1]; // the part after "/f/"
      
        if (key) {
          await new UTApi().deleteFiles(key);
        }
      }

      const newAvatarUrl = file.ufsUrl

      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          avatarUrl: newAvatarUrl,
        },
      });

      return { avatarUrl: newAvatarUrl };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;