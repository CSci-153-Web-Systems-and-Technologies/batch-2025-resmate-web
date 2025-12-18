import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage, VersionFeedback } from "@/lib/model/messages";
import { FileText, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageBox } from "./message-box";
import { sendMessage } from "@/lib/db/message-db";
import { User } from "@/lib/model/user";
import { getCurrentUser } from "@/lib/auth/actions/auth";
import { useRealtimeMessages } from "@/hooks/realtime-chat";

type VersionCardProps = {
  version: VersionFeedback;
};

export function VersionCard({
  version,
}: VersionCardProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const realtimeMessages = useRealtimeMessages(version.version_id!);

  useEffect(() => {
    const getUser = async () => {
      // Placeholder for getting current user logic
      const user: User | null = await getCurrentUser();
      setCurrentUser(user);
    }
    getUser();
  }, []);


  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setIsSending(true);
    try {
      const messageToSend: ChatMessage = {
        version_id: version.version_id!,
        message: newMessage.trim(),
        sender_id: currentUser?.userId || ""
      };

      await sendMessage(messageToSend);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border rounded-2xl p-4 md:p-6 bg-white shadow-sm mb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-3 flex-1">
          <Link href={`/feedback/annotate/${version.version_id}`}
            className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-2 hover:opacity-90"
            aria-label={`Open annotations for ${version.file_name}`}
          >
            <FileText className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-sm md:text-base">{version.file_name}</span>
          </Link>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4">

          <span className={`text-sm md:text-base font-semibold ${"text-gray-700"}`}>
            {new Date(version.created_at!).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric", 
              year: "numeric",
            })}{" "}
           
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3">
        {realtimeMessages.map((message) => {
          return (
            <MessageBox key={message.message_id} message={message} senderId={message.sender_id} currentUserId={currentUser?.userId || ""} />
          )
        })}
      </div>

      {/* Message Input - Only for latest version and if not closed */}
      {!version.isClosed ? (
        <div className="mt-4 space-y-3">
          <Textarea
            placeholder="Type your message here."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="min-h-[100px] resize-none"
            disabled={isSending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="w-full md:w-auto"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {isSending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      ) : (
        <div className="mt-4 bg-blue-600 text-white text-center py-3 rounded-xl font-medium text-sm md:text-base">
          Feedback for this version is closed.
        </div>
      )}
    </div>
  );
}