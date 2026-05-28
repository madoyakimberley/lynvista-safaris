import { createUploadthing } from "uploadthing/next";
const f = createUploadthing();

export const ourFileRouter = {
  // This defines the "safariImage" uploader
  safariImage: f({
    image: { maxFileSize: "6MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    // This runs after the file is successfully uploaded to storage
    return { url: file.url };
  }),
};
