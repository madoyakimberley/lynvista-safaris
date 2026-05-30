import { createUploadthing } from "uploadthing/next";
const f = createUploadthing();

export const ourFileRouter = {
  // This defines the "safariImage" uploader
  safariImage: f({
    image: { maxFileSize: "6MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    // This runs after the file is successfully uploaded to storage
    console.log("Upload completed! File object data:", file);

    // Safely grab whichever URL string your current version is providing
    const fileUrl = file.ufsUrl || file.url;

    return { url: fileUrl, ufsUrl: fileUrl };
  }),
};
