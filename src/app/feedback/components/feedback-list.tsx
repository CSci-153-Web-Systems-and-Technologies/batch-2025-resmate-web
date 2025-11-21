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
    <>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-grey-400" />
          <Input placeholder="Search" className="pl-9" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        
      </div>
    </>
  );
}