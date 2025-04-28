"use client";

import PartyCard from '@/components/PartyCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@clerk/nextjs';
import { Calendar, Heart, Share2, User, Users, Vote, Wine } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const PartyDetails = ({ party }) => {
  const router = useRouter();
  const { isSignedIn } = useAuth();


  return (
    <div className="py-10 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-36">
      <div className="flex flex-col lg:flex-row gap-10">

      
        <div className="w-full lg:w-5/12 space-y-8">
       
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold leading-tight">
              {party.name}
            </h1>
            <Badge className="bg-blue-600 w-14 h-14 flex items-center justify-center rounded-full shadow-xl text-lg">
              {party.partyNumber}
            </Badge>
          </div>

     
          <Card className="p-8 space-y-4">
            <div className="flex items-center gap-4">
              <User className="text-blue-500" />
              <div>
                <p className="text-gray-600 text-sm">თავმჯდომარე</p>
                <p className="font-semibold">{party.partyLeader}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Calendar className="text-blue-500" />
              <div>
                <p className="text-gray-600 text-sm">დაარსების წელი</p>
                <p className="font-semibold">{party.foundedYear}</p>
              </div>
            </div>
          </Card>

         
          <Card className="p-8">
            <p className="text-gray-700 leading-relaxed">
              {party.description}
            </p>
          </Card>
        </div>

        
        <div className="w-full lg:w-7/12">
          <div className="aspect-video rounded-lg overflow-hidden relative shadow-lg">
            {party.imageUrl && party.imageUrl.length > 0 ? (
              <Image
                src={party.imageUrl}
                alt={party.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Wine className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>

          <Button className="w-full mt-12 bg-[#4379F2] cursor-pointer"> <Vote /> ხმის მიცემა</Button>
        </div>




      </div>

      <div className="mt-12 flex flex-col gap-4">
  <h1 className="text-2xl font-semibold flex items-center gap-4">
    <Users /> პარტიის წევრები
  </h1>
  <span className="w-full h-1 bg-blue-400"></span>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
    {party.members.map((member) => (
      <div key={member.id} className="flex flex-col items-center justify-center text-center group">
   
        <div className="w-48 h-48 relative rounded-full overflow-hidden mb-4 shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105">
          <Image
            src={member.imageUrl}
            alt={member.name}
            width={200}
            height={200}
            className="object-cover w-full h-full"
          />
        </div>

       
        <Badge className="text-sm bg-[#4379F2] font-semibold">{member.name}</Badge>
      </div>
    ))}
  </div>
</div>
    </div>
  );
};

export default PartyDetails;
