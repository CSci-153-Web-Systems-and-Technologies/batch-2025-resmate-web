'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell } from "lucide-react";

import { Conversation, DraftSubmission, VersionFeedback, ChatMessage } from "@/lib/model/messages";
import { User } from "@/lib/model/user";

import { getConversations, getUserParticipants } from "@/lib/db/message-db";
import { ContactPerson } from "./contact-person";
import { DraftArea } from "./draft-area";
import { DraftSelectorDialog } from "../modal/draft-selector";

type VersionsByDraftRecord = Record<string, VersionFeedback[]>;

export default function FeedbackClient(props: {
  initialConversationId: string;
  otherParticipant: User | null;
  initialDrafts: DraftSubmission[];
  initialVersionsByDraft: VersionsByDraftRecord;
  initialMessages: ChatMessage[];
}) {
  const router = useRouter();

  // Source of truth for which conversation is open comes from the route
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    props.initialConversationId || null
  );

  // Sidebar state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [otherParticipants, setOtherParticipants] = useState<Map<string, User>>(new Map());

  // Conversation content state
  const [drafts, setDrafts] = useState<DraftSubmission[]>(props.initialDrafts || []);
  const [versionsByDraft] = useState<Map<string, VersionFeedback[]>>(
    new Map(Object.entries(props.initialVersionsByDraft || {}))
  );
  const [selectedDraft, setSelectedDraft] = useState<DraftSubmission | null>(
    props.initialDrafts?.at(-1) ?? null
  );
  const [isDraftSelectorOpen, setIsDraftSelectorOpen] = useState(false);

  // Keep local selection in sync with the route-provided id
  useEffect(() => {
    setSelectedConversation(props.initialConversationId || null);
    setDrafts(props.initialDrafts || []);
    setSelectedDraft(props.initialDrafts?.at(-1) ?? null);
  }, [props.initialConversationId, props.initialDrafts]);

  const selectedConversationData = useMemo(
    () => conversations.find((c) => c.conversation_id === selectedConversation),
    [conversations, selectedConversation]
  );

  // Load sidebar data (conversations + the "other" participant for each)
  useEffect(() => {
    let cancelled = false;

    const loadSidebar = async () => {
      setIsLoadingConversations(true);
      try {
        // If you have the current user id on the client, pass it to getConversations.
        // Otherwise, keep your existing implementation.
        const convos = await getConversations("__current_user__"); // replace with actual current user id if needed
        if (cancelled) return;
        setConversations(convos);

        // Fetch the "other participant" per conversation (N requests; consider batching on server if slow)
        const map = new Map<string, User>();
        for (const c of convos) {
          const other = await getUserParticipants(c.conversation_id, "__current_user__"); // replace with actual current user id if needed
          if (other) map.set(c.conversation_id, other);
        }
        if (cancelled) return;
        setOtherParticipants(map);
      } catch (e) {
        console.error("Failed loading conversations:", e);
        if (!cancelled) {
          setConversations([]);
          setOtherParticipants(new Map());
        }
      } finally {
        if (!cancelled) setIsLoadingConversations(false);
      }
    };

    loadSidebar();
    return () => {
      cancelled = true;
    };
  }, []);

  // Navigate to a conversation (lets the server prefetch bundle for that id)
  const handleSelectContact = (id: string) => {
    // Optional prefetch for snappier UX
    router.prefetch(`/feedback/${id}`);
    router.push(`/feedback/${id}`);
  };

  // Header block for the selected conversation
  const Header = () => {
    if (!selectedConversation) return null;
    const participant = otherParticipants.get(selectedConversation);
    const initials =
      participant ? `${participant.firstName?.[0] ?? ""}${participant.lastName?.[0] ?? ""}` : "NA";

    return (
      <div className="bg-white border-b p-4 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => router.push("/feedback")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="hidden md:flex bg-gray-800 text-white rounded-full w-10 h-10 items-center justify-center text-sm font-semibold">
              {initials}
            </div>

            <div className="hidden md:block">
              <h3 className="font-semibold">
                {participant ? `${participant.firstName} ${participant.lastName}` : "Loading..."}
              </h3>
              <p className="text-sm text-gray-600">Conversation</p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={() => setIsDraftSelectorOpen(true)}>
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex w-80 bg-white flex-col border-r flex-shrink-0">
          <div className="px-4 py-3 border-b">
            <h2 className="font-semibold">Conversations</h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoadingConversations ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex items-center justify-center h-full p-6 text-gray-500">
                No conversations yet
              </div>
            ) : (
              conversations.map((c) => {
                const p = otherParticipants.get(c.conversation_id);
                const initials =
                  p ? `${p.firstName?.[0] ?? ""}${p.lastName?.[0] ?? ""}` : "NA";
                const isSelected = c.conversation_id === selectedConversation;

                return (
                  <ContactPerson
                    key={c.conversation_id}
                    name={p ? `${p.firstName} ${p.lastName}` : "Loading..."}
                    preview={"No messages yet"}
                    initials={initials}
                    isSelected={isSelected}
                    onClick={() => handleSelectContact(c.conversation_id)}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden">
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-lg mb-2">Select a conversation</p>
                <p className="text-sm">Choose a contact to view messages</p>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop header duplicate for better layout */}
              <div className="hidden md:block">
                {/* The Header already renders above; keep minimal duplication here if needed */}
              </div>

              {/* Draft selector */}
              <DraftSelectorDialog
                conversationId={selectedConversation}
                open={isDraftSelectorOpen}
                onOpenChange={setIsDraftSelectorOpen}
                onSelectDraft={(draft) => setSelectedDraft(draft)}
              />

              {/* Draft content */}
              {selectedDraft ? (
                <DraftArea draft={selectedDraft} />
              ) : drafts.length > 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Select a draft to view feedback
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  No drafts yet
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}