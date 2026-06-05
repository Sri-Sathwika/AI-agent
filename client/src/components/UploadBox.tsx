"use client";

import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { api } from "@/lib/api";
import { documentStore } from "@/lib/documentStore";

export default function UploadBox() {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [dragging, setDragging] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const handleUpload = async (
    file: File
  ) => {
    if (
      file.type !==
      "application/pdf"
    ) {
      toast.error(
        "Please upload a PDF"
      );
      return;
    }

    try {
      setUploading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      await api.post(
        "/upload/",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        `${file.name} uploaded`
      );

      documentStore.notify();
    } catch (error) {
      console.error(error);

      toast.error(
        "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept=".pdf"
        onChange={(e) => {
          const file =
            e.target.files?.[0];

          if (file)
            handleUpload(file);
        }}
      />

      <div
        onClick={() =>
          inputRef.current?.click()
        }
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() =>
          setDragging(false)
        }
        onDrop={(e) => {
          e.preventDefault();

          setDragging(false);

          const file =
            e.dataTransfer
              .files?.[0];

          if (file)
            handleUpload(file);
        }}
        className={`
          rounded-3xl
          p-6
          text-center
          cursor-pointer
          transition-all
          glass

          ${
            dragging
              ? `
                border-purple-500
                scale-[1.02]
              `
              : ""
          }
        `}
      >
        <div
          className="
          h-16
          w-16
          rounded-2xl
          bg-purple-500/10
          mx-auto
          mb-4
          flex
          items-center
          justify-center
        "
        >
          <UploadCloud
            size={32}
            className="text-purple-400"
          />
        </div>

        <h3
          className="
          font-semibold
          text-lg
        "
        >
          {uploading
            ? "Uploading..."
            : "Upload PDF"}
        </h3>

        <p
          className="
          text-sm
          text-zinc-500
          mt-2
        "
        >
          Drag & drop PDF files
          here
        </p>

        <p
          className="
          text-xs
          text-zinc-600
          mt-2
        "
        >
          or click to browse
        </p>

        {dragging && (
          <div
            className="
            mt-3
            text-sm
            text-purple-400
          "
          >
            Release to upload
          </div>
        )}
      </div>
    </>
  );
}