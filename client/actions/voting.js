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

    
    const existingVote = await db.vote.findFirst({
      where: {
        userId: user.id,
      },
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
      voted: true,
     
    };

  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error.message || "Something went wrong",
    };
  }
}

export async function getPartiesWithVotes() {
  const parties = await db.party.findMany({
    include: {
      _count: {
        select: { votedBy: true },
      },
    },
  });

  const totalVotes = parties.reduce((sum, party) => sum + party._count.votedBy, 0);

  const partiesWithPercentages = parties.map((party) => ({
    id: party.id,
    name: party.name,
    voteCount: party._count.votedBy,
    votePercentage: totalVotes > 0 ? Math.round((party._count.votedBy / totalVotes) * 100) : 0,
  }));

  return partiesWithPercentages;
}

