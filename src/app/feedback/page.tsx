'use client';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, FileText, Menu, Search, Upload } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SubmitDraftModal } from "./modal/submission";
import { ContactPerson } from "./components/contact-person";

type Feedback = {
  id: string;
  document: string;
  version: number;
  date: string;
  status: string;
  comment: string;
  commentDate: string;
  isClosed: boolean;
};

export default function FeedbackPage() {
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSubmitDraft = (data: {
    recipient: string;
    title: string;
    file: File | null;
    message: string;
  }) => {
    console.log("Draft submitted:", data);
    setIsModalOpen(false);
  };

  const feedbacks: Record<string, Feedback[]> = {
    maria: [
      {
        id: "1",
        document: "Proposal_v1.pdf",
        version: 1,
        date: "August 10, 2025",
        status: "Rejected",
        comment: "The research methodology section needs more detail on data collection procedures.",
        commentDate: "August 10, 2025, 2:15 PM",
        isClosed: false,
      }
    ],
    juan: [
      {
        id: "2",
        document: "Proposal_v2.pdf",
        version: 2,
        date: "August 30, 2025",
        status: "In Review",
        comment: "The research methodology section needs more detail on data collection procedures. Please expand on the sampling strategy and include justification for your chosen approach.",
        commentDate: "August 30, 2025, 2:30 PM",
        isClosed: false,
      },
      {
        id: "3",
        document: "Proposal_v2.pdf",
        version: 2,
        date: "August 30, 2025",
        status: "In Review",
        comment: "Thank you for the feedback. I'll expand on the sampling strategy and add more details about the data collection procedures.",
        commentDate: "August 30, 2025, 2:30 PM",
        isClosed: true,
      },
    ],
    pedro: [],
    fidel: [],
  };

  const contacts = [
    { id: "maria", name: "Maria Ramos", preview: "You: I'll revise the problem..." },
    { id: "juan", name: "Juan Dela Cruz", preview: "You: I'll revise the problem..." },
  ];

  const currentFeedbacks = feedbacks[selectedFeedback || ""] || [];
  const selectedContact = contacts.find((c) => c.id === selectedFeedback);

  const handleSelectContact = (id: string) => {
    setSelectedFeedback(id);
    setIsSidebarOpen(false);
  };

  const ContactList = () => (
    <>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-grey-400" />
          <Input placeholder="Search" className="pl-9" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <ContactPerson
            key={contact.id}
            name={contact.name}
            preview={contact.preview}
            initials={contact.name.split(" ").map((n) => n[0]).join("")}
            isSelected={contact.id === selectedFeedback}
            onClick={() => handleSelectContact(contact.id)}
          />
        ))}
      </div>

      <div className="p-4 border-t">
        <Button className="w-full" variant="default" onClick={() => setIsModalOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Submit New Draft
        </Button>
      </div>
    </>
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Top Header */}
      <div className="bg-white border-b p-4 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile: Back button when conversation is selected */}
            {selectedFeedback && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSelectedFeedback(null)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}

            {/* Mobile: Menu button when no conversation selected */}
            {!selectedFeedback && (
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80">
                  <div className="h-full flex flex-col bg-white">
                    <div className="p-4 border-b">
                      <h2 className="text-xl font-semibold">Feedback</h2>
                    </div>
                    <ContactList />
                  </div>
                </SheetContent>
              </Sheet>
            )}

            <h2 className="text-xl font-semibold">
              {/* Mobile: Show contact name when selected */}
              {selectedFeedback && selectedContact ? (
                <span className="md:hidden">{selectedContact.name}</span>
              ) : null}

              {/* Desktop: Always show "Feedback" */}
              <span className="hidden md:inline">Feedback</span>

              {/* Mobile: Show "Feedback" when no selection */}
              {!selectedFeedback && <span className="md:hidden">Feedback</span>}
            </h2>
          </div>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content - Changed from flex to flex-col on mobile, flex-row on desktop */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden md:flex w-80 bg-white flex-col border-r flex-shrink-0">
          <ContactList />
        </div>

        {/* Content Area - Full height on both mobile and desktop */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden">
          {/* Mobile: Show contact list when no selection */}
          {!selectedFeedback && (
            <div className="flex-1 flex flex-col md:hidden">
              <div className="flex-1 overflow-y-auto">
                {contacts.map((contact) => (
                  <ContactPerson
                    key={contact.id}
                    name={contact.name}
                    preview={contact.preview}
                    initials={contact.name.split(" ").map((n) => n[0]).join("")}
                    isSelected={false}
                    onClick={() => handleSelectContact(contact.id)}
                  />
                ))}
              </div>

              <div className="p-4 border-t">
                <Button className="w-full" variant="default" onClick={() => setIsModalOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Submit New Draft
                </Button>
              </div>
            </div>
          )}

          {/* Conversation View - Mobile when selected, Desktop always */}
          {selectedFeedback && selectedContact && (
            <>
              {/* Contact Header - Desktop only */}
              <div className="hidden md:flex p-4 border-b items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-800 text-white rounded-full w-12 h-12 flex items-center justify-center text-sm font-semibold">
                    {selectedContact.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedContact.name}</h3>
                    <p className="text-sm text-gray-600">Associate Professor</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>

              {/* Message Area */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">
                  Proposal Draft Feedback
                </h2>

                {currentFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="space-y-2 md:space-y-3">
                    {/* Document info */}
                    <div className="bg-gray-50 p-3 md:p-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                          <span className="font-medium text-sm md:text-base truncate">
                            {feedback.document}
                          </span>
                        </div>
                        <div className="text-left md:text-right">
                          <span className="text-xs md:text-sm text-gray-600">
                            Version {feedback.version}
                          </span>
                        </div>
                      </div>
                      <div className="text-left md:text-right text-xs md:text-sm text-gray-600">
                        {feedback.date} | Status: {feedback.status}
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                      <div
                        className={`p-3 md:p-4 ${
                          feedback.isClosed
                            ? "bg-blue-600 text-white ml-auto max-w-full md:max-w-md"
                            : "bg-gray-100"
                        }`}
                      >
                        <p className="text-sm">{feedback.comment}</p>
                        <p
                          className={`text-xs mt-2 ${
                            feedback.isClosed ? "text-blue-200" : "text-gray-500"
                          }`}
                        >
                          {feedback.commentDate}
                        </p>
                      </div>
                    </div>

                    {feedback.isClosed && (
                      <div className="bg-blue-100 text-blue-800 p-3 text-center text-xs md:text-sm font-medium">
                        This feedback thread is closed.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Desktop: Show empty state when no selection */}
          {!selectedFeedback && (
            <div className="hidden md:flex flex-1 items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-lg mb-2">Select a conversation</p>
                <p className="text-sm">Choose a contact to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <SubmitDraftModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} onSubmit={handleSubmitDraft} />
    </div>
  );
}