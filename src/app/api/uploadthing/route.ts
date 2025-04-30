import { createRouteHandler } from "uploadthing/next";
import { fileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: fileRouter,
  config: {
    token: process.env.NEXT_PUBLIC_UPLOADTHING_TOKEN,
  },
});
