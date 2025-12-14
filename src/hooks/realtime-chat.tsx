
import { ChatMessage } from '@/lib/model/messages';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export function useRealtimeMessages(versionId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
 
  useEffect(() => {
     const supabase = createClient();
    if (!versionId) return;

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('version_id', versionId)
        .order('created_at', { ascending: true });

      if (data) setMessages(data);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`conversation:${versionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `version_id=eq.${versionId}`
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [versionId]);

  return messages;
}