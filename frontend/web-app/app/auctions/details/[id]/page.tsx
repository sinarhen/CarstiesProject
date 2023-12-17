import { getAuction, getBidsForAuction } from '@/actions/auctionActions';
import Heading from '@/components/Heading';
import CountdownTimer from '@/components/CountdownTimer';
import React from 'react';
import DetailedSpecs from './components/DetailedSpecs';
import { getCurrentUser } from '@/actions/authActions';
import { EditButton } from "./components/EditButton";
import DeleteAuctionButton  from './components/DeleteAuctionButton';
import ExtendableImage from '@/components/ExtendableImage';
import BidItem from './components/BidItem';
import BidList from './components/BidList';


export default async function Details({params}: {
  params: {
    id: string
  }

}) {

  const data = await getAuction(params.id);
  const user = await getCurrentUser();
  
  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          <Heading title={data.make + " " + data.model}/>
          {user?.username == data.seller && (
            <div className='gap-x-3 flex'>
              <EditButton initialValues={data}/>
              <DeleteAuctionButton auctionId={data.id}/>          
            </div>
          )}
          
        </div>
        <div>
          <h3 className='text-2xl font-semibold'>Time remaining:</h3>
          <CountdownTimer auctionEnd={data.auctionEnd}/>
        </div>

      </div>
      <div className='grid grid-cols-2 gap-6 mt-3'>
        <div className='w-full h-fit rounded-lg overflow-hidden'>
          <ExtendableImage imageUrl={data.imageUrl} />
        </div>
        
        <BidList user={user} auction={data}/>
        

      </div>

      <div className='mt-3 grid grid-cols-1 rounded-lg'>
        <DetailedSpecs auction={data}/>
      </div>
    </div>
  );
}
