export type ChatMessage = {
  message_id?: string;
  version_id: string;
  sender_id: string;
  message: string;
  created_at?: string;
}

export type Conversation = {
  conversation_id: string;
  created_at?: string;
}

export type ConversationParticipant = {
  conversation_participant_id: string;
  conversation_id: string;
  user_id: string;
}

export type DraftSubmission = {
  draft_id?: string;
  conversation_id: string;
  draft_title: string;
  created_at?: string;
}

export type VersionFeedback = {
  version_id?: string;
  draft_id?: string;
  file_url: string;
  file_name: string;
  isClosed?: boolean;
  created_at?: string;
}