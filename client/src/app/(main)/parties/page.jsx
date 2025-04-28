"use client"

import React, { useEffect } from 'react'
import useFetch from '../../../../hooks/useFetch';
import { getParties } from '../../../../actions/parties';
import PartyCard from '@/components/PartyCard';

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
    return (<div className="loader-container">
    <div className="loader-cube">
      <div className="loader-side front"></div>
      <div className="loader-side back"></div>
      <div className="loader-side left"></div>
      <div className="loader-side right"></div>
      <div className="loader-side top"></div>
      <div className="loader-side bottom"></div>
    </div>
  </div>)
  
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
