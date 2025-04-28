import { checkUser } from '@/lib/checkUser'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { Component, Heart, Layout, LogIn, User } from 'lucide-react';
import logo from '../assets/logo.png'

const Header = async ({ isAdminPage = false}) => {
   
    const user = await checkUser();

    const isAdmin = user?.role === "ADMIN";
    
  return (
    <header className=' top-0 w-full backdrop-blur-md z-50 '>
    <nav className='mx-auto px-12 py-4 flex items-center justify-between'>
      <Link href = {isAdminPage ? "/admin" : "/"}>
           <Image src = {logo} alt = "logo" width = {150} height={150} />
          {isAdminPage && (
         <span className="text-xs font-extralight">admin</span>
       )}
      </Link>

      <div className='flex gap-4 '>
       <SignedIn>
            
           
       <Link href = "/parties">
            <Button className="bg-[#4379F2] hover:bg-[#5d74a6] cursor-pointer">
             <Component /> ყველა პარტია</Button>
            </Link>
       </SignedIn>
         
             {isAdmin && (
             <Link href="/admin">
               <Button variant="outline" className="flex items-center gap-2">
                 <Layout size={18} />
                 <span className="hidden md:inline">პორტალი</span>
               </Button>
             </Link>
           )}



       <SignedOut>
         <SignInButton forceRedirectUrl='/'>
            <Button  className="cursor-pointer bg-[#1E3E62]"> <LogIn />შესვლა</Button>
         </SignInButton>
       </SignedOut>

 
       <SignedIn>
         <UserButton appearance={
           {
             elements: {
              avatarImage: "w-36 h-36"
             }
           }
         } />
       </SignedIn>
    
      </div>
     
    </nav>
 </header>
  )
}

export default Header
