import React from 'react';
import Search from "@/components/navbar/Search";
import Logo from "@/components/navbar/Logo";


export default function () {
    return (
    <header className='
        sticky top-0 z-50 bg-white p-5 items-center text-gray-800 shadow-md flex justify-between
    '>
        <Logo />
        <Search />
        <div>Login</div>
    </header>
  )
}
