"use client";

import ReactMarkdown from "react-markdown";
import { FileText } from "lucide-react";
import { sourceStore } from "@/lib/sourceStore";

interface Props {
  role: "user" | "assistant";
  content: string;

  sources?: {
    source: string;
    page: number;
    content: string;
  }[];
}

export default function MessageBubble({
  role,
  content,
  sources,
}: Props) {
  const handleSourceClick = () => {
    sourceStore.setSources(
      sources || []
    );
  };

  const isUser =
    role === "user";

  return (
    <div
      className={`flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`
          max-w-[85%]
          rounded-[28px]
          px-6
          py-5

          ${
            isUser
              ? `
                bg-gradient-to-r
                from-purple-600
                to-fuchsia-600
              `
              : `
                glass
              `
          }
        `}
      >
        <ReactMarkdown
          components={{
            h1: ({
              children,
            }) => (
              <h1 className="text-2xl font-bold mb-3">
                {children}
              </h1>
            ),

            h2: ({
              children,
            }) => (
              <h2 className="text-xl font-semibold mb-2 mt-4">
                {children}
              </h2>
            ),

            p: ({
              children,
            }) => (
              <p className="mb-2 leading-7">
                {children}
              </p>
            ),

            ul: ({
              children,
            }) => (
              <ul className="list-disc ml-5 space-y-1">
                {children}
              </ul>
            ),

            strong: ({
              children,
            }) => (
              <strong className="font-semibold">
                {children}
              </strong>
            ),
          }}
        >
          {content}
        </ReactMarkdown>

        {!isUser &&
          sources &&
          sources.length >
            0 && (
            <button
              onClick={
                handleSourceClick
              }
              className="
                mt-5
                flex
                items-center
                gap-2
                text-sm
                text-purple-400
                hover:text-purple-300
              "
            >
              <FileText
                size={16}
              />
              View Sources (
              {sources.length})
            </button>
          )}
      </div>
    </div>
  );
}