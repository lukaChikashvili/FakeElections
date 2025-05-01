"use client"

import React, { useEffect } from 'react'
import useFetch from '../../../../hooks/useFetch';
import { getParties } from '../../../../actions/parties';
import PartyCard from '@/components/PartyCard';
import { Skeleton } from '@/components/ui/skeleton';


const AllParties = () => {

    const {
        loading: PartyLoading,
        fn: fetchParty,
        data: partyResult,
        error: partyError
   } = useFetch(getParties);

   useEffect(() => {
    fetchParty();
   }, []);

   if (PartyLoading) {
    return (
      <>
      <Skeleton className="h-8 w-40 mb-5" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-24">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="rounded-lg border overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
                <div className="pt-2 flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </div>
            </div>
          ))}
        
      </div>
      </>
  )
  
  }

  if (partyError) {
    return <div className="text-center text-xl text-red-600">Error loading parties. Please try again.</div>;
  }



  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
    {partyResult?.data?.map((value) => (
      <PartyCard key={value.id} value={value} />
    ))}
  </div>
  )
}

export default AllParties
