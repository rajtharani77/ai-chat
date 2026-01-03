'use client';

import { useEffect, useState, use } from "react";
import { notFound, useRouter } from "next/navigation";
import { Chat } from "./../../components/chat"; 


interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params); 
  
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await fetch(`/api/conversations/${resolvedParams.id}`);

        if (res.status === 404 || res.status === 403) {

          notFound(); 
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await res.json();
        const formatted: Message[] = data.messages.map((m: any) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

        setInitialMessages(formatted);
      } catch (error) {
        console.error("Error loading chat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-2">
           <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
           <p className="text-gray-500 text-sm">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <Chat 
      id={resolvedParams.id} 
      initialMessages={initialMessages} 
    />
  );
}