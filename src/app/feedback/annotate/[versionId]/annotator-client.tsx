"use client";

import dynamic from "next/dynamic";
import { ComponentType, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageBox } from "@/app/feedback/components/message-box";
import { useRealtimeMessages } from "@/hooks/realtime-chat";
import { getCurrentUser } from "@/lib/auth/actions/auth";
import { sendMessage } from "@/lib/db/message-db";
import type { ChatMessage } from "@/lib/model/messages";
import type { User } from "@/lib/model/user";
import { MessageSquare } from "lucide-react";

// Dynamically load your PDF annotator toolbar/viewer (client-only)
const PdfToolbar: ComponentType<any> = dynamic(async () => {
  const mod = await import("@/lib/pdf/components/toolbar");
  // Try common exports
  const Comp = (mod as any).default ?? (mod as any).Toolbar ?? (mod as any).CustomToolbar;
  if (!Comp) {
    // Throw to trigger Next’s error boundary and show a clear message
    throw new Error("PDF toolbar export not found. Check src/lib/pdf/components/toolbar/index.tsx for a default export.");
  }
  return Comp as any;
}, { ssr: false, loading: () => <div className="p-4">Loading PDF annotator…</div> });

export default function AnnotatorClient({
  versionId,
}: {
  versionId: string;
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messages = useRealtimeMessages(versionId);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      setCurrentUser(u);
    })();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setIsSending(true);
    try {
      const messageToSend: ChatMessage = {
        version_id: versionId,
        message: newMessage.trim(),
        sender_id: currentUser?.userId || "",
      };
      await sendMessage(messageToSend);
      setNewMessage("");
    } catch (e) {
      console.error("Failed to send message:", e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] gap-4 p-4">
      <div className="flex-1 min-w-0 border rounded-xl overflow-hidden">
        {fileUrl ? (
          <div className="w-full h-full">
            <PdfToolbar
              file={fileUrl}
              url={fileUrl}
              pdfUrl={fileUrl}
              src={fileUrl}
              onChange={() => { /* noop or wire to your handler */ }}
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-600 p-6 text-center">
            No fileUrl provided. Append ?fileUrl=&lt;encoded PDF URL&gt; to the page URL
            or fetch the PDF URL by versionId.
          </div>
        )}
      </div>

      <aside className="w-full md:w-96 flex flex-col border rounded-xl p-3">
        <h3 className="font-semibold mb-2">Comments</h3>
        <div className="flex-1 overflow-auto space-y-3 pr-1">
          {messages.map((m) => (
            <MessageBox
              key={m.message_id}
              message={m}
              senderId={m.sender_id}
              currentUserId={currentUser?.userId || ""}
            />
          ))}
        </div>

        {!isClosed ? (
          <div className="mt-3 space-y-2">
            <Textarea
              placeholder="Type your message here."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[90px] resize-none"
              disabled={isSending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              className="w-full"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        ) : (
          <div className="mt-3 bg-blue-600 text-white text-center py-2 rounded-lg text-sm">
            Feedback for this version is closed.
          </div>
        )}
      </aside>
    </div>
  );
}