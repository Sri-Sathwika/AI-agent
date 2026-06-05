"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  MessageSquare,
  FileText,
  Database,
  Sparkles,
} from "lucide-react";

// import UploadBox from "./UploadBox";
import { api } from "@/lib/api";
import { sessionStore } from "@/lib/sessionStore";
import {documentStore} from "@/lib/documentStore";
import { documentViewerStore } from "@/lib/documentViewerStore";

interface SessionItem {
  id: string;
  title: string;
}

interface DocumentItem {
  name: string;
  size: number;
}

export default function Sidebar() {
  const [sessions, setSessions] =
    useState<SessionItem[]>([]);

  const [documents, setDocuments] =
    useState<DocumentItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchSessions = async () => {
    try {
      const res = await api.get(
        "/sessions"
      );

      setSessions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments =
    async () => {
      try {
        const res =
          await api.get(
            "/documents"
          );

        setDocuments(
          res.data
        );
      } catch (err) {
        console.error(err);
      }
    };

  useEffect(() => {
    fetchSessions();
    fetchDocuments();

    const unsubDocs =
      documentStore.subscribe(
        fetchDocuments
      );

    const unsubSessions =
      sessionStore.subscribe(
        fetchSessions
      );

    return () => {
      unsubDocs();
      unsubSessions();
    };
  }, []);

  const createNewChat = () => {
    const id =
      crypto.randomUUID();

    localStorage.setItem(
      "sessionId",
      id
    );

    window.location.reload();
  };

  const loadChat = (
    sessionId: string
  ) => {
    localStorage.setItem(
      "sessionId",
      sessionId
    );

    window.location.reload();
  };

  const totalMB = (
    documents.reduce(
      (acc, doc) =>
        acc + doc.size,
      0
    ) /
    (1024 * 1024)
  ).toFixed(2);

  return (
    <div
      className="
      h-full
      overflow-y-auto
      px-5
      py-6
    "
    >
      {/* Header */}

      <div className="mb-6">
        <div
          className="
          flex
          items-center
          gap-3
          mb-2
        "
        >
          <div
            className="
            h-12
            w-12
            rounded-2xl
            glass
            glow-purple
            flex
            items-center
            justify-center
          "
          >
            <Sparkles
              size={22}
              className="text-purple-400"
            />
          </div>

          <div>
            <h1
              className="
              text-2xl
              font-bold
            "
            >
              Research AI
            </h1>

            <p className="text-xs text-zinc-400">
              Document Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Upload */}

      {/* <UploadBox /> */}

      {/* New Chat */}

      <button
        onClick={createNewChat}
        className="
        mt-5
        w-full
        h-12
        rounded-2xl
        bg-gradient-to-r
        from-purple-600
        to-fuchsia-600
        font-medium
        flex
        items-center
        justify-center
        gap-2
        hover:opacity-90
      "
      >
        <Plus size={18} />
        New Chat
      </button>

     
      {/* Documents */}

      <div className="mt-6">
        <div
          className="
          flex
          items-center
          gap-2
          mb-3
        "
        >
          <FileText
            size={18}
            className="text-purple-400"
          />

          <h2 className="font-semibold">
            Documents
          </h2>
        </div>

        <div className="space-y-2">
          {documents.map((doc, index) => (
  <div
    key={index}
    onClick={() =>
      documentViewerStore.setDocument(
        doc.name
      )
    }
    className="
      glass
      rounded-2xl
      p-3
      cursor-pointer
      hover:border-purple-500/50
      transition
    "
  >
    <p className="font-medium truncate">
      {doc.name}
    </p>

    <p className="text-xs text-zinc-500">
      {(doc.size / 1024 / 1024).toFixed(1)}
      {" "}MB
    </p>
  </div>
))}
        </div>
      </div>

      {/* Chats */}

      <div className="mt-6">
        <div
          className="
          flex
          items-center
          gap-2
          mb-3
        "
        >
          <MessageSquare
            size={18}
            className="text-purple-400"
          />

          <h2 className="font-semibold">
            Recent Chats
          </h2>
        </div>

        {loading ? (
          <div className="text-sm text-zinc-500">
            Loading...
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map(
              (session) => (
                <div
                  key={session.id}
                  onClick={() =>
                    loadChat(
                      session.id
                    )
                  }
                  className="
                  glass
                  rounded-2xl
                  p-3
                  cursor-pointer
                  card-hover
                "
                >
                  <p
                    className="
                    text-sm
                    truncate
                  "
                  >
                    {session.title}
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
} 