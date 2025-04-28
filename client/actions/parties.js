"use server";

import { db } from "@/lib/prisma";
import { createClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function AddPartyToDB({ partyData, images }) {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const partyId = uuidv4();
    const folderPath = `parties/${partyId}`;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const imageUrls = [];

    for (let i = 0; i < images.length; i++) {
      const base64Data = images[i];
      if (!base64Data || !base64Data.startsWith("data:image/")) {
        console.warn("Skipping invalid image data");
        continue;
      }

      const base64 = base64Data.split(",")[1];
      const imageBuffer = Buffer.from(base64, "base64");

      const mimeMatch = base64Data.match(/data:image\/([a-zA-Z0-9]+);/);
      const fileExtension = mimeMatch ? mimeMatch[1] : "jpeg";

      const fileName = `image-${Date.now()}-${i}.${fileExtension}`;
      const filePath = `${folderPath}/${fileName}`;

      const { error } = await supabase.storage
        .from("matxovari-img")
        .upload(filePath, imageBuffer, {
          contentType: `image/${fileExtension}`,
        });

      if (error) {
        console.error("Error uploading image:", error);
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/matxovari-img/${filePath}`;
      imageUrls.push(publicUrl);
    }

    if (imageUrls.length === 0) {
      throw new Error("No valid images were uploaded");
    }

   
    const party = await db.party.create({
      data: {
        id: partyId,
        name: partyData.name,
        imageUrl: imageUrls[0], 
        partyNumber: partyData.partyNumber,
        partyLeader: partyData.partyLeader,
        foundedYear: partyData.foundedYear,
        description: partyData.description
      },
    });


    for (let i = 0; i < partyData.members.length; i++) {
      const member = partyData.members[i];

      await db.member.create({
        data: {
          name: member.name,
          imageUrl: member.imageUrl, 
          partyId: party.id,

        },
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error adding party: " + error.message);
  }
}


export async function getParties() {
   try {

    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const parties = await db.party.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return {
      success: true,
      data: parties
    }
    
   } catch (error) {
     console.log(error)
   }
}

export async function deleteParty(id) {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    await db.member.deleteMany({
      where: {
        partyId: id, 
      },
    });

    await db.party.delete({
      where: {id}
    });


    return {
      success: true,
    };
    
  } catch (error) {
    console.log(error)
  }
}


export async function getPartyById(partyId) {
  try {
    const { userId } = await auth();
    let dbUser = null;

    if (userId) {
      dbUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    }

    const party = await db.party.findUnique({
      where: { id: partyId },
      include: {
        members: true, 
      },
      
    });

    if (!party) {
      return {
        success: false,
        error: "Party not found",
      };
    }

    return {
      success: true,
      data: party,
      user: dbUser, 
    };

  } catch (error) {
    console.error("Error fetching party:", error);
    return {
      success: false,
      error: "Something went wrong",
    };
  }
}