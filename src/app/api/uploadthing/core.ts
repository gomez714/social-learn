import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
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

      await Promise.all([
        prisma.user.update({
          where: {id: metadata.user.id},
          data: {
            avatarUrl: newAvatarUrl
          }
        }),
        streamServerClient.upsertUser({
          id: metadata.user.id,
          set: {
            image: newAvatarUrl,
          }
        })
      ])


      return { avatarUrl: newAvatarUrl };
    }),
    attachment: f({
      image: { maxFileSize: "4MB", maxFileCount: 5 },
      video: { maxFileSize: "64MB", maxFileCount: 5 },
    })
      .middleware(async () => {
        const { user } = await validateRequest();
  
        if (!user) throw new UploadThingError("Unauthorized");
  
        return {};
      })
      .onUploadComplete(async ({ file }) => {
        const media = await prisma.media.create({
          data: {
            url: file.ufsUrl,
            type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
          },
        });
  
        return { mediaId: media.id };
      }),
    
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;