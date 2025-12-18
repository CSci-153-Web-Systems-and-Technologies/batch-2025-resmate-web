import { ChatMessage } from "@/lib/model/messages";

type MessageBoxProps = {
  senderId: string;
  currentUserId: string;
  message: ChatMessage;
}

function isOwnMessage(senderId: string, currentUserId: string) {
  return senderId === currentUserId;
}

function formatMessageTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function MessageBox({
  senderId,
  currentUserId,
  message,
}: MessageBoxProps) {
  const isOwner = isOwnMessage(senderId, currentUserId);

   return (
    <div
      key={message.message_id}
      className={`flex ${isOwner ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] md:max-w-[60%] rounded-lg p-3 md:p-4 ${
          isOwner
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        
        {/* Message content */}
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.message}
        </p>
        
        {/* Timestamp */}
        <p
          className={`text-xs mt-2 ${
            isOwner ? 'text-blue-200' : 'text-gray-500'
          }`}
        >
          {formatMessageTime(message.created_at!)}
        </p>
      </div>
    </div>
  );
}