import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type ContactPersonProps = {
  name: string;
  preview: string;
  initials: string;
  isSelected?: boolean;
  onClick: () => void;
}

export function ContactPerson({
  name,
  preview,
  initials,
  isSelected = false,
  onClick,
}: ContactPersonProps) {
  return (
    <div
      onClick={onClick}
      className={`w-full px-4 py-3 flex items-center gap-4 transition-all duration-200 cursor-pointer ${
        isSelected ? "bg-gray-200 hover:bg-gray-200" : "bg-white hover:bg-gray-50"
      }`}
    >
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarFallback className="bg-gray-900 text-white font-semibold text-base">
          {initials}
        </AvatarFallback>        
      </Avatar>
      
      <div className="flex-1 text-left min-w-0">
        <h4 className="font-semibold text-lg text-gray-900 truncate mb-0.5">{name}</h4>
        <p className="text-sm text-gray-600 truncate">{preview}</p>
      </div>
    </div>
  )
}