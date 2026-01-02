import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response('Unauthorized', { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return new Response('User not found', { status: 404 });
    }
    const { messages, id } = await req.json();
    let conversationId = id;

    if (!conversationId) {
      const title = messages[0].content.substring(0, 30);
      const conversation = await prisma.conversation.create({
        data: { title, userId: user.id },
      });
      conversationId = conversation.id;
    }
    await prisma.message.create({
      data: {
        content: messages[messages.length - 1].content,
        role: 'user',
        conversationId,
      },
    });
    const result = streamText({
      model: google('gemini-2.5-flash'),
      messages,
      async onFinish({ text }) {
        await prisma.message.create({
          data: {
            content: text,
            role: 'assistant',
            conversationId,
          },
        });
      },
    });

    return result.toTextStreamResponse();
    
  } catch (error) {
    console.error("CHAT API ERROR:", error); 
    return new Response('Internal Server Error', { status: 500 });
  }
}