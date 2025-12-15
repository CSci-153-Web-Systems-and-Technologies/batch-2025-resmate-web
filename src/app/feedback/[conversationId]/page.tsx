import { loadConversationBundle } from "@/lib/db/message-db";
import FeedbackClient from "../components/feedback-client";
import { getCurrentUser } from "@/lib/auth/actions/auth";

export default async function FeedbackConversationPage(props: { params: Promise<{ conversationId: string }> }) {
  const params = await props.params;

  console.log("Conversation ID:", params.conversationId);

  return <FeedbackPage initialConversationId={params.conversationId} />;
}