'use client';

import { MessageSquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewChatButton() {
  const router = useRouter();

  const handleNewChat = () => {
    window.location.href = '/'; 
  };

  return (
    <button 
      onClick={handleNewChat}
      className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
    >
      <MessageSquarePlus size={20} />
      New Chat
    </button>
  );
}