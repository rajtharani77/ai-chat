'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function Home() {
 const [messages, setMessages] = useState([
    { id: 'welcome', role: 'assistant', content: "What's on your mind?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;


    const userMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: input 
    };


    setMessages((prev) => [...prev, userMessage]);
    setInput(''); 
    setIsLoading(true);

    try {

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.body) throw new Error("No response body");

      const aiMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev, 
        { id: aiMessageId, role: 'assistant', content: '' }
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          lastMsg.content += chunkValue; 
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error in chat:', error);
      alert('Failed to send message.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full">
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-200'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="flex justify-start"><Loader2 className="animate-spin text-gray-400" /></div>}
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-900">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            className="w-full bg-gray-800 text-white rounded-xl py-4 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Send a message..."
            value={input}
            onChange={handleInputChange}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 p-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
      
    </div>
  );
}
