import React from 'react'
import PartyList from './_components/PartyList'

export const metadata = {
  title: "პარტიების მართვა | fakeElections"
 }
 
const page = () => {
  return (
    <div className='w-full px-12 py-12'>
      <h1 className='text-3xl font-bold'>პარტიების მენეჯმენტი</h1>
      <PartyList />
    </div>
  )
}

export default page
