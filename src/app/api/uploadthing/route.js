import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core"; // You'll create this next

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
