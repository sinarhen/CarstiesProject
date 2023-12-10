import React from 'react';
import Heading from "@/components/Heading";
import AuctionForm from "@/app/auctions/create/components/AuctionForm";

const Page = () => {
  return (
    <div className='mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg '>
      <Heading title='Sell your car!' subtitle='Please enter the details for your car'/>
      <AuctionForm />
    </div>
  )
};

export default Page;
