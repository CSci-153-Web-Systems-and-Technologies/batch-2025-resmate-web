'use client';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell } from "lucide-react";
import { useEffect, useState } from "react";

import { ContactPerson } from "./components/contact-person";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/actions/auth";
import { User } from "@/lib/model/user";
import { Conversation, DraftSubmission } from "@/lib/model/messages";
import { getConversations, getDraftSubmissions, getUserParticipants } from "@/lib/db/message-db";
import { ContactList } from "./components/contact-list";
import { DraftArea } from "./components/draft-area";
import { DraftSelectorDialog } from "./modal/draft-selector";

export default function FeedbackPage({
  initialConversationId
} : { initialConversationId: string }) {
  const router = useRouter()

  const [selectedConversation, setSelectedConversation] = useState<string | null>(initialConversationId ?? null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  const [otherParticipants, setOtherParticipants] = useState<Map<string, User>>(new Map());

  const [selectedDraft, setSelectedDraft] = useState<DraftSubmission | null>(null);

  const [isDraftSelectorOpen, setIsDraftSelectorOpen] = useState(false);

  // If dynamic route provides the id, use it
  useEffect(() => {
    if (initialConversationId) {
      setSelectedConversation(initialConversationId);
    }
  }, [initialConversationId]);

  // Fallback: still support ?conversation=... param
  useEffect(() => {
    if (initialConversationId) {
      setSelectedConversation(initialConversationId);
    }
  }, [initialConversationId]);

  const handleSelectContact = (id: string) => {
    setSelectedConversation(id);
    router.push(`/feedback/${id}`); // dynamic segment navigation
    console.log("Selected conversation ID:", id);
  };


  useEffect(() => {
    const loadDraftForConversation = async () => {
      if (!selectedConversation) {
        setSelectedDraft(null);
        // setThreadVersions([]);
        return;
      }

      try {
        const drafts = await getDraftSubmissions(selectedConversation);
        // setDrafts(drafts);

        if(!drafts.length) {
          setSelectedDraft(null);
          // setThreadVersions([]);
          return;
        }

        // Pick latest by created_at (fallback to first)
        const latest =
          [...drafts].sort((a, b) =>
            new Date(a.created_at || "").getTime() - new Date(b.created_at || "").getTime()
          )[drafts.length - 1] || drafts[0];

        setSelectedDraft(latest);

      } catch (error) {
        console.error("Error loading draft submissions:", error);
        setSelectedDraft(null);
        // setThreadVersions([]);
      }
    };

    loadDraftForConversation();
  }, [selectedConversation]);


  useEffect(() => {
    const fetchAllParticipants = async () => {
      if (!currentUser || conversations.length === 0) return;

      const participantsMap = new Map<string, User>();
      for(const conversation of conversations) {
        const participant = await getUserParticipants(conversation.conversation_id, currentUser.userId);

        if(participant) {
          participantsMap.set(conversation.conversation_id, participant);
        }
      }
      setOtherParticipants(participantsMap);
    }
    fetchAllParticipants();
  }, [currentUser, conversations]);


  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUser()
      setCurrentUser(user)
    };
    getUser()
  }, [])

   useEffect(() => {
    if (!currentUser) return;

    const loadConversations = async () => {
      setIsLoadingConversations(true);
      try {
        const data = await getConversations(currentUser.userId);

        console.log('Loaded conversations:', data); // Debug log
      
          setConversations(data);
        } catch (error) {
          console.error("Error loading conversations:", error);
        } finally {
          setIsLoadingConversations(false);
        }
      };

    loadConversations();
  }, [currentUser]);

  const selectedConversationData = conversations.find(
    (c) => c.conversation_id === selectedConversation
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Top Header */}
      {selectedConversation && (
        <div className="bg-white border-b p-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile: Back button when conversation is selected */}
              {selectedConversation && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div> 
      )}
      

      {/* Main Content - Changed from flex to flex-col on mobile, flex-row on desktop */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden md:flex w-80 bg-white flex-col border-r flex-shrink-0">
          <ContactList
            user={currentUser}
            conversations={conversations}
            otherParticipants={otherParticipants}
            isLoadingConversations={isLoadingConversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectContact}
          />
        </div>

        {/* Content Area - Full height on both mobile and desktop */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden">
          {/* Mobile: Show contact list when no selection */}
          {!selectedConversation && (
            <div className="flex-1 flex flex-col md:hidden">
              <div className="flex-1 overflow-y-auto">
                {isLoadingConversations ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-gray-500">Loading conversations...</p>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <p className="text-gray-500 text-center mb-2">No conversations yet</p>
                    <p className="text-sm text-gray-400 text-center">
                      Submit a draft to start a conversation with an adviser
                    </p>
                  </div>
                ) : (
                  conversations.map((conversation) => {

                    const participant = otherParticipants.get(conversation.conversation_id);

                    if (!participant) return null;

                    const isSelected = conversation.conversation_id === selectedConversation;

                    return (
                      <ContactPerson
                        key={conversation.conversation_id}
                        name={`${participant?.firstName} ${participant?.lastName}`}
                        preview={"No messages yet"}
                        initials={`${participant?.firstName[0]}${participant?.lastName[0]}`}
                        isSelected={isSelected}
                        onClick={() => handleSelectContact(conversation.conversation_id)}
                      />
                    );
                  })
                )}
              </div>

              {/* <div className="p-4 border-t">
                <Button className="w-full" variant="default">
                  <Upload className="h-4 w-4 mr-2" />
                  Submit New Draft
                </Button>
              </div> */}
            </div>
          )}

          {/* Conversation View - Mobile when selected, Desktop always */}
          {selectedConversation && selectedConversationData && (
            <>
              {/* Contact Header - Desktop only */}
              {(() => {
                const participant = otherParticipants.get(selectedConversation);
                return (
                  <div className="hidden md:flex p-4 border-b items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-800 text-white rounded-full w-12 h-12 flex items-center justify-center text-sm font-semibold">
                        {`${participant?.firstName[0]}${participant?.lastName[0]}`}
                      </div>
                      <div>
                        <h3 className="font-semibold">{`${participant?.firstName} ${participant?.lastName}`}</h3>
                        <p className="text-sm text-gray-600">Associate Professor</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsDraftSelectorOpen(true)}>
                      <Bell className="h-5 w-5" />
                    </Button>
                  </div>
                );
              })()}

              <DraftSelectorDialog
                conversationId={selectedConversation}
                open={isDraftSelectorOpen}
                onOpenChange={setIsDraftSelectorOpen}
                onSelectDraft={(draft) => {
                  setSelectedDraft(draft)
                }}
              />

              {/* Single Draft Area for the chosen draft */}
              {selectedDraft ? (
                <DraftArea
                  draft={selectedDraft}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Loading draft feedback…
                </div>
              )}
            </>
          )}

          {/* Desktop: Show empty state when no selection */}
          {!selectedConversation && (
            <div className="hidden md:flex flex-1 items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-lg mb-2">Select a conversation</p>
                <p className="text-sm">Choose a contact to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}