'use client';

import React, {FunctionComponent, useState} from 'react';
import {FaSearch} from "react-icons/fa";
import {useParamsStore} from "@/hooks/useParamsStore";
import { usePathname, useRouter } from 'next/navigation';

const Search = () => {
  const router = useRouter();
  const pathname = usePathname();


  const setParams = useParamsStore(state => state.setParams);

  const setValue = useParamsStore(state => state.setSearchValue);
  const value = useParamsStore(state => state.searchValue);

  function onChange(event: any){
    setValue(event.target.value);
  }

  function search(){
    if (pathname !== '/') router.push('/');

    setParams({searchTerm: value})
  }

  return (
    <div className='flex w-1/2 items-center border-2 rounded-full py-2 shadow-sm'>
      <input
        onKeyDown={(event: any) => {
          if (event.key === 'Enter') search();
        }}
        onChange={onChange}
        value={value}
        type="text"
        placeholder="Search for cars by make, model or color"
        className='
          flex-grow
          pl-5
          bg-transparent
          focus:outline-none
          border-transparent
          focus:border-transparent
        '
      />
      <button onClick={search}>
        <FaSearch size={34} className='bg-red-400 text-white rounded-full p-2 cursor-pointer mx-2'/>
      </button>
    </div>
  );
};

export default Search;
