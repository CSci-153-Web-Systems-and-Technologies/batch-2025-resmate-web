'use client';
import { Button } from "@/components/ui/button";
import { Bell, FileText, Search, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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
  const [selectedFeedback, setSelectedFeedback] = useState<string>("juan");
  const [message, setMessage] = useState("");

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
    { id: "pedro", name: "Pedro Reyes", preview: "You: I'll revise the problem..." },
    { id: "fidel", name: "Fidel Garcia", preview: "You: I'll revise the problem..." },
  ];

  const currentFeedbacks = feedbacks[selectedFeedback] || [];
  const selectedContact = contacts.find((c) => c.id === selectedFeedback);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4">
      {/* Left Sidebar - Contact list */}
      <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Feedback</h2>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-grey-400" />
            <Input placeholder="Search" className="pl-9" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedFeedback(contact.id)}
              className={`w-full p-4 items-center gap-3 hover:bg-gray-50 transition-colors border-b ${
                selectedFeedback === contact.id ? "bg-gray-50" : ""
              }`}
            >
              <div className="bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {contact.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-sm truncate">{contact.name}</p>
                <p className="text-xs text-gray-500 truncate">{contact.preview}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t">
          <Button className="w-full" variant="default">
            <Upload className="h-4 w-4 mr-2" />
            Submit New Draft
          </Button>
        </div>  
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gray-800 text-white rounded-full w-12 h-12 flex items-center justify-center text-sm font-semibold">
              {selectedContact?.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h3 className="font-semibold">{selectedContact?.name}</h3>
              <p className="text-sm text-gray-600">Associate Professor IV</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Proposal Draft Feedback</h2>

          {currentFeedbacks.map((feedback) => (
            <div key={feedback.id} className="space-y-3">
              {/* Document info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span className="font-medium">{feedback.document}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">Version {feedback.version}</span>
                  </div>     
                </div>
                <div className="text-right text-sm text-gray-600">
                  {feedback.date} - {feedback.status}
                </div>
              </div>

              {/* Comment Section */}
              <div className="space-y-2">
                <div className={`rounded-lg p-4 ${feedback.isClosed ? "bg-blue-600 text-white ml-auto max-w-md" : "bg-gray-100"}`}>
                  <p className="text-sm">{feedback.comment}</p>
                  <p className={`text-xs mt-2 ${feedback.isClosed ? "text-blue-100" : "text-gray-500"}`}>
                    {feedback.commentDate}
                  </p>
                </div>
              </div>

              {feedback.isClosed && (
                <div className="bg-blue-100 text-blue-800 rounded-lg p-3 text-center text-sm font-medium">
                  Feedback for version 1 is closed.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}