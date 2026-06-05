"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Sparkles,
  FileText,
  Search,
  BookOpen,
  Plus,
} from "lucide-react";

import { toast } from "react-hot-toast";

import MessageBubble from "./MessageBubble";
import { Message } from "@/types";
import { api } from "@/lib/api";
import { getSessionId } from "@/lib/session";
import { documentStore } from "@/lib/documentStore";

export default function ChatArea() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const question = input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat", {
        session_id: getSessionId(),
        message: question,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.answer,
          sources: res.data.sources || [],
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", file);

      await api.post("/upload/", formData, {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      });

      toast.success(
        `${file.name} uploaded successfully`
      );

      documentStore.notify();
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    }
  };

  const FeatureCard = ({
    icon,
    title,
    description,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }) => (
    <div
      className="
        glass
        rounded-3xl
        p-5
        text-left
        card-hover
      "
    >
      <div className="mb-3">{icon}</div>

      <h3 className="font-semibold mb-1">
        {title}
      </h3>

      <p className="text-sm text-zinc-400">
        {description}
      </p>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Hidden Upload Input */}

      <input
        hidden
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={(e) => {
          const file =
            e.target.files?.[0];

          if (file) {
            handleUpload(file);
          }
        }}
      />

      {/* Chat Content */}

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div
            className="
              h-full
              flex
              items-center
              justify-center
              px-10
            "
          >
            <div className="max-w-4xl w-full">
              <div className="text-center">
                <div
                  className="
                    h-24
                    w-24
                    rounded-3xl
                    glass
                    glow-purple
                    mx-auto
                    flex
                    items-center
                    justify-center
                    mb-8
                  "
                >
                  <Sparkles
                    size={40}
                    className="text-purple-400"
                  />
                </div>

                <h1
                  className="
                    text-4xl
                    font-bold
                    mb-4
                  "
                >
                  Welcome to{" "}
                  <span className="text-purple-500">
                    Research AI
                  </span>
                </h1>

                <p
                  className="
                    text-lg
                    text-zinc-400
                    max-w-2xl
                    mx-auto
                  "
                >
                  Upload PDFs, ask
                  questions, and get
                  accurate answers from
                  your documents.
                </p>
              </div>

              <div
                className="
                  grid
                  grid-cols-3
                  gap-5
                  mt-14
                "
              >
                <FeatureCard
                  icon={
                    <FileText className="text-purple-400" />
                  }
                  title="Upload PDFs"
                  description="Add multiple documents and build your knowledge base."
                />

                <FeatureCard
                  icon={
                    <Search className="text-purple-400" />
                  }
                  title="Ask Questions"
                  description="Search across documents using natural language."
                />

                <FeatureCard
                  icon={
                    <BookOpen className="text-purple-400" />
                  }
                  title="Document Search"
                  description="Get accurate answers from uploaded PDFs."
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="
              px-10
              py-8
              space-y-6
            "
          >
            {messages.map(
              (message, index) => (
                <MessageBubble
                  key={index}
                  role={message.role}
                  content={message.content}
                  sources={
                    message.sources
                  }
                />
              )
            )}

            {loading && (
              <div
                className="
                  glass
                  rounded-3xl
                  p-5
                  w-fit
                "
              >
                <div className="flex gap-2">
                  <span className="animate-bounce">
                    ●
                  </span>

                  <span
                    className="animate-bounce"
                    style={{
                      animationDelay:
                        "0.15s",
                    }}
                  >
                    ●
                  </span>

                  <span
                    className="animate-bounce"
                    style={{
                      animationDelay:
                        "0.3s",
                    }}
                  >
                    ●
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Composer */}

      <div className="p-8">
        <div
          className="
            glass
            rounded-4xl
            p-4
          "
        >
          <div className="flex items-end gap-4">
            {/* Upload Button */}

            <button
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="
                h-15
                w-15
                shrink-0
                rounded-2xl
                glass
                flex
                items-center
                justify-center
                hover:border-purple-500/50
              "
            >
              <Plus size={24} />
            </button>

            {/* Input */}

            <textarea
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              placeholder="Ask anything about your documents..."
              rows={2}
              className="
                flex-1
                bg-transparent
                resize-none
                outline-none
                text-white
                placeholder:text-zinc-500
              "
              onKeyDown={(e) => {
                if (
                  e.key ===
                    "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            {/* Send Button */}

            <button
              onClick={sendMessage}
              disabled={loading}
              className="
                h-15
                w-15
                shrink-0
                rounded-2xl
                bg-linear-to-r
                from-purple-600
                to-fuchsia-600
                flex
                items-center
                justify-center
              "
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}