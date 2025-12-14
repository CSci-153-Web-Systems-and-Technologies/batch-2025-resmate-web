import FeedbackPage from "../page";

export default function FeedbackConversationPage({
  params,
}: { params: { conversationId: string } }) {

  return <FeedbackPage initialConversationId={params.conversationId} />;
}