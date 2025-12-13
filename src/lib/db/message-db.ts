'use server';

import { createClient } from "@/utils/supabase/server";
// import { createClient } from "@/utils/supabase/server";
import { ChatMessage, Conversation, DraftSubmission, VersionFeedback } from "../model/messages";
import { User } from "../model/user";
import { getUserById } from "./user-db";
import { version } from "os";

export async function closeOlderVersionsForDraft(draftId: string): Promise<void> {
  const supabase = await createClient();

  // Get all versions for this draft, sorted by created_at desc (latest first)
  const { data: versions, error: fetchErr } = await supabase
    .from('version_feedback')
    .update({ is_closed: true })
    .eq('draft_id', draftId)

  if (fetchErr) {
    console.error('closeOlderVersionsForDraft: fetchErr', fetchErr);
    return;
  }
  // const keepOpenId = newVersionId ?? versions[0].version_id;
  // const toClose = versions.filter(v => v.version_id !== keepOpenId && !v.is_closed);

  // if (toClose.length === 0) return;

  // const { error: updateErr } = await supabase
  //   .from('version_feedback')
  //   .update({ 'is_closed': true })
  //   .in('version_id', toClose.map(v => v.version_id));

  // if (updateErr) {
  //   console.error('closeOlderVersionsForDraft: updateErr', updateErr);
  // }
}



/**
 * Retrieves a list of conversations for a given user by their user ID.
 *
 * This function queries the `conversation_participants` table to find all conversation IDs
 * associated with the specified user. If an error occurs during the query, it logs the error
 * and returns an empty array.
 *
 * @param userId - The unique identifier of the user whose conversations are to be fetched.
 * @returns A promise that resolves to an array of `Conversation` objects containing conversation IDs.
 */
export async function getConversations(userId: string): Promise<Conversation[]> {
  const supabase = await createClient();

  const { data: conversations, error: convoError} = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', userId);

  if(convoError) {
    console.error('Error fetching conversations:', convoError);
    return [];
  }

  const conversationsList: Conversation[] = conversations ? conversations.map((convo) => {
    return { conversation_id: convo.conversation_id };
  }) : [];

  return conversationsList;
}


/**
 * Creates a new conversation between a student and an adviser in the database.
 *
 * @param studentId - The unique identifier of the student participant.
 * @param adviserId - The unique identifier of the adviser participant.
 * @returns A promise that resolves to the created `Conversation` object, or `null` if an error occurs.
 */
export async function createConversation(studentId: string, adviserId: string): Promise<Conversation | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('conversations')
    .insert({})
    .select()
    .single();

  if(error) {
    console.error('Error creating conversation:', error);
    return null;
  }

  const conversationId = data['conversation_id'];

  await addConversationParticipant(conversationId, studentId, adviserId);

  return { conversation_id: conversationId } as Conversation;
}


/**
 * Adds both a student and an adviser as participants to a conversation in the database.
 *
 * @param conversationId - The unique identifier of the conversation.
 * @param studentId - The unique identifier of the student to add as a participant.
 * @param adviserId - The unique identifier of the adviser to add as a participant.
 * @returns A promise that resolves when the participants have been added.
 * @remarks
 * Logs an error to the console if the insertion fails.
 */
export async function addConversationParticipant(conversationId: string, studentId: string, adviserId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('conversation_participants')
    .insert([
      { conversation_id: conversationId, user_id: studentId },
      { conversation_id: conversationId, user_id: adviserId }
    ]);
  
  if(error) {
    console.error('Error adding conversation participants:', error);
    throw new Error('Failed to add conversation participants');
  }
}


export async function getConversationByParticipants(studentId: string, adviserId: string): Promise<Conversation | null> {
  const supabase = await createClient();

  // Fetch all participant rows for either user
  const { data, error } = await supabase
    .from('conversation_participants')
    .select('conversation_id, user_id')
    .in('user_id', [studentId, adviserId]);

  if (error) {
    console.error('Error fetching conversation participants:', error);
    return null;
  }
  if (!data || data.length === 0) {
    return null;
  }

  // Group by conversation_id and ensure it contains both IDs
  const byConversation = new Map<string, Set<string>>();
  for (const row of data) {
    const set = byConversation.get(row.conversation_id) ?? new Set<string>();
    set.add(row.user_id);
    byConversation.set(row.conversation_id, set);
  }

  const matchedConversationId = [...byConversation.entries()]
    .find(([, users]) => users.has(studentId) && users.has(adviserId))?.[0];

  if (!matchedConversationId) {
    return null;
  }

  return { conversation_id: matchedConversationId } as Conversation;
}


export async function getUserParticipants(conversationId: string, userId: string): Promise<User | null> {
  const supabase = await createClient();  

  const { data, error } = await supabase
    .from('conversation_participants')
    .select('user_id')
    .eq('conversation_id', conversationId)
    .neq('user_id', userId);

  if(error) {
    console.error('Error fetching conversation participants:', error);
    return null;
  }

  if (!data || data.length === 0) {
    console.log('No participants found for conversation:', conversationId);
    return null;
  }

  const user = await getUserById(data[0].user_id);
  return user;
}


export async function sendMessage(chat: ChatMessage): Promise<void>  {
  const supabase = await createClient();

  const { error } = await supabase
    .from('messages')
    .insert({
      'version_id': chat.version_id,
      'message': chat.message,
      'sender_id': chat.sender_id,
    });

  if(error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
}


export async function createDraftSubmission(draft: DraftSubmission): Promise<DraftSubmission | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('draft_submissions')
    .insert({
      'conversation_id': draft.conversation_id,
      'title': draft.draft_title,
    })
    .select()
    .single();

  if(error) {
    console.error('Error creating draft submission:', error);
    // throw new Error('Failed to create draft submission');
    return null;
  }

  const draftId = data['draft_id'];

  return {
    draft_id: draftId,
  } as DraftSubmission;
}

// TODO: Implement the function to create a new version feedback
export async function createVersionFeedback(version: VersionFeedback): Promise<VersionFeedback | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('version_feedback')
    .insert({
      'draft_id': version.draft_id,
      'file_url': version.file_url,
      'file_name': version.file_name,
      'is_closed': version.isClosed || false,
    })
    .select()
    .single();
    
  if(error) {
    console.error('Error creating version feedback:', error);
    // throw new Error('Failed to create version feedback');
    return null;
  }

  const versionId = data['version_id'];

  return {
    version_id: versionId,
  } as VersionFeedback;
}


export async function getDraftSubmissions(conversationId: string): Promise<DraftSubmission[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('draft_submissions')
    .select('*')
    .eq('conversation_id', conversationId);

  if(error) {
    console.error('Error fetching draft submissions:', error);
    return [];
  }

  const drafts: DraftSubmission[] = data ? data.map((draft) => ({
    draft_id: draft.draft_id,
    conversation_id: draft.conversation_id,
    draft_title: draft.title,
    created_at: draft.created_at,
  })) : [];

  return drafts;
}


export async function getVersionFeedbacks(draftId: string): Promise<VersionFeedback[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('version_feedback')
    .select('*')
    .eq('draft_id', draftId)
    .order('created_at', { ascending: true });

  if(error) {
    console.error('Error fetching version feedbacks:', error);
    return [];
  }

  const versions: VersionFeedback[] = data ? data.map((version) => ({
    version_id: version.version_id,
    draft_id: version.draft_id,
    file_url: version.file_url,
    file_name: version.file_name,
    isClosed: version.is_closed,
    created_at: version.created_at,
  })) : [];

  return versions;
}


export async function getMessagesByVersion(versionId: string): Promise<ChatMessage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('version_id', versionId)
    .order('created_at', { ascending: true });

  if(error) {
    console.error('Error fetching messages by version:', error);
    return [];
  }

  const messages: ChatMessage[] = data ? data.map((message) => ({
    message_id: message.message_id,
    version_id: message.version_id,
    sender_id: message.sender_id,
    message: message.message,
    created_at: message.created_at,
  })) : [];

  return messages;
}