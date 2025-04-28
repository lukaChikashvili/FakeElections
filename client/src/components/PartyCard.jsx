"use client"
import Image from 'next/image';
import React from 'react'
import { Button } from './ui/button';
import { CardContent } from './ui/card';

const PartyCard = ({value}) => {
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
      <h2 className="font-bold text-slate-800">{value?.name?.substring(0, 25)}...</h2>
      
     
    </CardContent>

  
    <Button onClick={() => {
            router.push(`/tamadas/${value.id}`);
          }} className="cursor-pointer bg-[#4379F2]" >
      დეტალურად ნახვა
    </Button>
  </div>
  )
}

export default PartyCard
