"use client"
import Image from 'next/image';
import React, { useState } from 'react'
import { Button } from './ui/button';
import { CardContent } from './ui/card';
import { Check, Eye, Vote } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { voteForParty } from '../../actions/voting';
import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';

const PartyCard = ({value}) => {
  const { isSignedIn } = useAuth();
    const router = useRouter();

    const [isVoted, setIsVoted] = useState(value?.voted);
  

    
    
    const handleVoting = async () => {
      try {
        const res = await voteForParty(value.id);
        console.log("Voting response:", res);
        
        if (res?.success) {
          toast.success("თქვენ მიეცით ხმა");
          setIsVoted(true); 
        } else {
          toast.error(res?.message || "ხმის მიცემისას მოხდა შეცდომა");
        }
      } catch (error) {
        toast.error("თქვენ უკვე მიეცით ხმა");
      }
    };

  return (
    <div className="relative flex flex-col gap-[10px] w-full border p-4 rounded-md mt-4 shadow-lg overflow-hidden">
      
   
    <div className="relative w-full h-[250px] rounded-md overflow-hidden group">
      {value && value?.imageUrl && value.imageUrl?.length > 0 ? (
        <div className="relative w-full h-full">
          <Image
            src={value?.imageUrl}
            alt={`${value?.name} ${value?.city}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />

         
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none" />

        
          
        </div>
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
         
        </div>
      )}
    </div>

    
    <CardContent>
      <h2 className="font-bold text-slate-800 ">{value?.name?.substring(0, 20)}...</h2>
      
        <h2><span className='text-sm italic underline underline-offset-4 text-slate-600'>თავმჯდომარე: </span>{value?.partyLeader?.substring(0, 17)}...</h2>
        <div className='flex items-center gap-2'>
       
        <span className='text-sm italic underline underline-offset-4 text-slate-600'>ხმების რაოდენობა: <span className='text-2xl text-blue-500'>{value.votes}</span></span>
        </div>
    </CardContent>

  <div className='flex items-center justify-center gap-2'>
    <Button onClick={() => {
            router.push(`/parties/${value.id}`);
          }} className="cursor-pointer flex items-center justify-center gap-2 "  variant="outline">
      <Eye  /> დეტალურად ნახვა
    </Button>

    <Button  onClick={handleVoting} className={`cursor-pointer ${isVoted ? "bg-green-500" : "bg-[#4379F2]"}`} >
    {isVoted ? <Check /> : <Vote /> }  {isVoted ? "ხმა მიცემულია" : "ხმის მიცემა"}
    </Button>
    </div>
  </div>
  )
}

export default PartyCard
