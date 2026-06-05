"use client";

import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import DocumentViewer from "@/components/DocumentViewer";
import { documentViewerStore } from "@/lib/documentViewerStore";
import { useEffect, useState } from "react";

export default function Home() {
  const [hasDocument, setHasDocument] =
    useState(false);

  useEffect(() => {
    const update = () => {
      setHasDocument(
        !!documentViewerStore.getDocument()
      );
    };

    update();

    return documentViewerStore.subscribe(
      update
    );
  }, []);

  return (
    <main className="h-screen bg-black text-white">
      <div className="flex h-full">
        <div className="w-[340px]">
          <Sidebar />
        </div>

        <div className="flex-1">
          <ChatArea />
        </div>

        {hasDocument && (
          <DocumentViewer />
        )}
      </div>
    </main>
  );
}