import React from 'react'
import AddPartyForm from './_components/AddPartyForm';



export const metadata = {
    title: "პარტიის დამატება | fakeElection",
    description: "დაამატე ახალი პარტია",
  };




export default function AddPartyPage() {
    return (
        <div className='px-36'>
            <h1 className="text-2xl font-bold mb-6">დაამატე პარტია</h1>
            <AddPartyForm />
            
        </div>
    )
}