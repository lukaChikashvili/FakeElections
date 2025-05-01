import React from 'react'
import { getPartyById } from '../../../../../actions/parties';
import { notFound } from 'next/navigation';
import PartyDetails from './_components/PartyDetails';




const PartyPage = async ({ params }) => {

    const { id } = await params;

    const result = await getPartyById(id);

    

    if (!result.success) {
        notFound();
      }
  return (
    <div>
       <div className="container mx-auto px-4 py-12 ">
    <PartyDetails party={result.data}  />
  </div>
    </div>
  )
}

export default PartyPage
