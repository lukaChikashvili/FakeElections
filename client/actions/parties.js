"use server"

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
  
        const { data, error } = await supabase.storage
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
          members: {
            create: partyData.members.map((member, index) => ({
              name: member.name,
              imageUrl: imageUrls[index + 1] || '', 
            })),
          },
        },
      });
  
      revalidatePath('/admin/parties');
  
      return { success: true };
    } catch (error) {
      throw new Error("Error adding party: " + error.message);
    }
  }
  