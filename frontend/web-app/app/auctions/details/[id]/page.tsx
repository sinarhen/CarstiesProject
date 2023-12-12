import { getAuction } from '@/actions/auctionActions';
import Heading from '@/components/Heading';
import CountdownTimer from '@/components/CountdownTimer';
import React from 'react';
import DetailedSpecs from './components/DetailedSpecs';
import { getCurrentUser } from '@/actions/authActions';
import { EditButton } from "./components/EditButton";
import DeleteAuctionButton  from './components/DeleteAuctionButton';
import ExtendableImage from '@/components/ExtendableImage';


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
            <div className='gap-x-3'>
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
        <div className='w-full bg-gray-200 rounded-lg overflow-hidden'>
          <ExtendableImage imageUrl={data.imageUrl} />
        </div>
        <div className='border-2 rounded-lg p-2 bg-gray-100'>
          <Heading title='Bids'/>
        </div>


      </div>

      <div className='mt-3 grid grid-cols-1 rounded-lg'>
        <DetailedSpecs auction={data}/>
      </div>
    </div>
  );
}
