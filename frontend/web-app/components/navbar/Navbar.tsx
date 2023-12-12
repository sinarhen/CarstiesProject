import React from 'react';
import Search from "@/components/navbar/Search";
import Logo from "@/components/navbar/Logo";
import LoginButton from "@/components/navbar/LoginButton";
import {getCurrentUser} from "@/actions/authActions";
import UserActions from "@/components/navbar/UserActions";


export default async function () {
    const user = await getCurrentUser();

    return (
    <header className='
        sticky top-0 z-40 bg-white p-5 items-center text-gray-800 shadow-md flex justify-between
    '>
        <Logo />
        <Search />
        { user ? (
          <UserActions user={user}/>
        ) : (
          <LoginButton />
        )}
    </header>
  )
}
