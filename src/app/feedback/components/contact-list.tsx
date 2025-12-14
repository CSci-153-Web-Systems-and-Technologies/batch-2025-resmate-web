import { Input } from "@/components/ui/input";
import { Conversation } from "@/lib/model/messages"
import { User } from "@/lib/model/user";
import { Search, Upload } from "lucide-react";
import { ContactPerson } from "./contact-person";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SubmitDraftModal } from "../modal/submission";

type ContactListProps = {
  conversations: Conversation[];
  otherParticipants: Map<string, User>;
  isLoadingConversations: boolean;
  selectedConversation: string | null;
  onSelectConversation: (conversationId: string) => void;
}

export function ContactList({
  conversations,
  otherParticipants,
  isLoadingConversations,
  selectedConversation,
  onSelectConversation,
}: ContactListProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
     <>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-grey-400" />
          <Input placeholder="Search conversations" className="pl-9" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoadingConversations ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-gray-500">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 p-4">
            <p className="text-sm text-gray-500 text-center">No conversations yet</p>
            <p className="text-xs text-gray-400 text-center mt-1">
              Submit a draft to start a conversation
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
                onClick={() => onSelectConversation(conversation.conversation_id)}
              />
            );
          })
        )}
      </div>

      <div className="p-4 border-t">
        <Button className="w-full" variant="default" onClick={() => setIsOpenModal(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Submit New Draft
        </Button>
      </div>

      <SubmitDraftModal isOpen={isOpenModal} onOpenChange={setIsOpenModal} />
    </>
  )
}