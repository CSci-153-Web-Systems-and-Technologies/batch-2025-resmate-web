import FeedbackPage from "../page";

export default async function FeedbackConversationPage(props: { params: Promise<{ conversationId: string }> }) {
  const params = await props.params;

  console.log("Conversation ID:", params.conversationId);

  return <FeedbackPage initialConversationId={params.conversationId} />;
}