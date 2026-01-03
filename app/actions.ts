'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; 
import { prisma } from "@/lib/prisma";

export async function getHistory() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return [];
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return [];
  const conversations = await prisma.conversation.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },

    include: {
      messages: {
        take: 1,
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  return conversations;
}