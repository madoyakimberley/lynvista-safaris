"use client";
import { useState } from "react";
import { UploadButton } from "@/app/utils/uploadthing";

export default function ImageFirstUpload() {
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  return (
    // Added 'text-black' to the main container to ensure all child text defaults to black
    <div className="p-10 text-black">
      <h2 className="text-xl font-bold mb-4">Step 1: Upload Safari Image</h2>

      {!imageUrl ? (
        <UploadButton
          endpoint="safariImage"
          onUploadBegin={() => setIsUploading(true)}
          onClientUploadComplete={(res) => {
            setImageUrl(res[0].url);
            setIsUploading(false);
          }}
        />
      ) : (
        <div className="space-y-4">
          <p className="text-green-700 font-bold">
            Image uploaded successfully!
          </p>
          <img
            src={imageUrl}
            alt="Safari Preview"
            className="w-64 rounded-lg"
          />

          <button
            className="bg-[#2d1b0b] text-black px-4 py-2 rounded"
            onClick={() => alert("Ready to save to TiDB with URL: " + imageUrl)}
          >
            Proceed to Save Tour Details
          </button>
        </div>
      )}
    </div>
  );
}
