'use client';

import React from 'react';
import {User} from "next-auth";
import Link from "next/link";
import {HiCog, HiUser} from "react-icons/hi2";
import {AiFillCar, AiFillTrophy} from "react-icons/ai";
import {signOut} from "next-auth/react";
import {usePathname, useRouter} from "next/navigation";
import {useParamsStore} from "@/hooks/useParamsStore";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button";
import {RxDropdownMenu} from "react-icons/rx";
import {ArrowDown, ChevronDown} from "lucide-react";
import {DropdownMenuArrow} from "@radix-ui/react-dropdown-menu";

type Props = {
  user: Partial<User>
}

export default function UserActions({user}: Props){
  const router = useRouter();
  const pathname = usePathname();
  const setParams = useParamsStore(state => state.setParams);

  function setWinner() {
    setParams({winner: user.username, seller: undefined})
    if (pathname !== '/') router.push('/');
  }

  function setSeller() {
    setParams({winner: undefined, seller: user.username})
    if (pathname !== '/') router.push('/');
  }


  return (
  <div className='transition-colors'>
    <DropdownMenu>
      <DropdownMenuTrigger asChild >
        <p className="flex cursor-pointer font-medium hover:text-red-600 transition-colors items-center">
          {user.username}
          <ChevronDown />
        </p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Welcome, {user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={setSeller} className='cursor-pointer hover:text-red-600'>
          <div className='flex items-center gap-x-1'>
            <HiUser/>
              My Auctions
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer hover:text-red-600">
          <div className='flex items-center gap-x-1'>
            <AiFillTrophy className='h-full w-auto' />
            <button onClick={setWinner}>
              Auctions won
            </button>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem className='cursor-pointer hover:text-red-600'>
          <div className='flex items-center gap-x-1'>
            <AiFillCar className='h-full w-auto' />
            <Link href="/auctions/create">
              Sell my car
            </ Link>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => signOut({callbackUrl: pathname})} className='cursor-pointer duration-500 text-end text-red-700 hover:bg-red-200'>

          Sign out

        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push('/session')} className='cursor-pointer hover:text-red-600'>
          <div className='flex items-center gap-x-1'>
            <HiCog className='h-full w-auto' />
            Session (dev only)

          </div>
        </DropdownMenuItem>




      </DropdownMenuContent>
    </DropdownMenu>

  </div>
  )
}