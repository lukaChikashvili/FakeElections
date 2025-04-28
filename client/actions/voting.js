"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function voteForParty(partyId) {
    try {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
  
      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
  
      if (!user) throw new Error("User not found");
  
      
      const existingVote = await db.vote.findUnique({
        where: {
          userId_partyId: { 
            userId: user.id, 
            partyId: partyId 
          }
        }
      });
  
      if (existingVote) {
        throw new Error("You have already voted for this party");
      }
  
   
      await db.vote.create({
        data: {
          userId: user.id,
          partyId,
        },
      });
  
      
      await db.party.update({
        where: { id: partyId },
        data: {
          votes: { increment: 1 },
        },
      });
  
      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: error.message || "Something went wrong",
      };
    }
  }
  