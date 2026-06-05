"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  X,
} from "lucide-react";

import { documentViewerStore } from "@/lib/documentViewerStore";

export default function DocumentViewer() {
  const [
    documentName,
    setDocumentName,
  ] = useState<string | null>(
    null
  );

  useEffect(() => {
    const update = () => {
      setDocumentName(
        documentViewerStore.getDocument()
      );
    };

    update();

    return documentViewerStore.subscribe(
      update
    );
  }, []);

  if (!documentName) {
    return null;
  }

  return (
    <div
      className="
        h-full
        w-[420px]
        border-l
        border-white/10
        bg-black/20
        backdrop-blur-xl
        flex
        flex-col
      "
    >
      <div
        className="
          h-16
          px-4
          border-b
          border-white/10
          flex
          items-center
          justify-between
        "
      >
        <div className="flex items-center gap-2">
          <FileText
            size={18}
            className="text-purple-400"
          />

          <span className="truncate">
            {documentName}
          </span>
        </div>

        <button
          onClick={() =>
            documentViewerStore.setDocument(
              null
            )
          }
          className="
            p-2
            rounded-lg
            hover:bg-white/10
            transition
          "
        >
          <X size={18} />
        </button>
      </div>

      <iframe
        src={`http://127.0.0.1:8000/uploads/${documentName}`}
        className="flex-1 w-full"
      />
    </div>
  );
}