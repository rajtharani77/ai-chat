import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "./components/SessionProvider";
import { MessageSquarePlus } from "lucide-react"; 
import LoginButton from "./components/LoginButton";
import NewChatButton from "./components/NewChatButton"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My-ChatBot",
  description: "Curious: Find Answer Here",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geistSans.className}>
        <AuthProvider>
          <div className="flex h-screen bg-gray-900 text-white">
            <aside className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <NewChatButton />
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
    
              </div>
              

              <div className="p-4 border-t border-gray-700">
                <LoginButton />
              </div>
            </aside>
            <main className="flex-1 flex flex-col h-full relative">
              {children}
            </main>
            
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
