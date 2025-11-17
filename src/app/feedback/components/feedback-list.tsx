"use client";

import { PlusIcon, Search } from "lucide-react";
import { Conversation } from "../messages";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FeedbackList({
  conversations,
  selectedId,
  onSelect
}: {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="h-full flex flex-col">
      {/* Header (Desktop) */}
      <div className="hidden md:flex item-center h-16 px-5 border-b border-slate-200">
        <h1 className="text-lg font-medium">Feedback</h1>
      </div>

      {/* Search + Submit button (mobile only) */}
      <div className="md:hidden px-3 py-3 space-y-3 border-b border-slate-200 bg-white sticky top-14 z-10">
        <div className="relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search" />
        </div>

        <Button>
          <PlusIcon className="h-5 w-5" />
          Submit
        </Button>
      </div>

      {/* Search (desktop only) */}
      <div className="hidden md:block px-4 py-3">
        <div className="relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search" />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-auto hin-scroll">
        <ul className="px-2 md:px-3 pb-4 space-y-1">
          {conversations.map((conversation) => {
            const selected = conversation.id === selectedId;
            return (
              <li key={conversation.id}>
                <Button
                  onClick={() => onSelect(conversation.id)}
                  className={selected ? "bg-slate-100" : "bg-white"}
                >
                  <div className="h-9 w-9 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">
                    {conversation.initials}
                  </div>

                  <div className="min-w-10">
                    <div className="font-medium truncate">{conversation.name}</div>
                    <div className="text-xs text-slate-500 truncate"> You: {conversation.preview}</div>
                  </div>
                </Button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="hidden md:block h-6" />
    </div>
  );
}