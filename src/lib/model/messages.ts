export type ChatMessage = {
  message_id?: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  createdAt?: string | number;
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
  submission_id?: string;
  conversation_id: string;
  student_id: string;
  adviser_id: string;
  draft_title: string;
  draft_file_url: string;
  draft_file_name: string;
  status?: string;
  created_at?: string;
}

export type VersionFeedback = {
  feedback_id?: string;
  submission_id: string;
  file_url: string;
  file_name: string;
  created_at?: string;
}