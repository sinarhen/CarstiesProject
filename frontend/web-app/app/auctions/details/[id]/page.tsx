import { getAuction } from '@/app/actions/auctionActions';
import Heading from '@/components/Heading';
import CountdownTimer from '@/components/auctions/CountdownTimer';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import React from 'react';
import Image from 'next/image';
import DetailedSpecs from './components/DetailedSpecs';
import { getCurrentUser } from '@/app/actions/authActions';
import { EditButton } from "./components/EditButton.1";
import CarImage from '@/components/auctions/CarImage';
import DeleteAuctionButton  from './components/DeleteAuctionButton';


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
            <>
              <EditButton initialValues={data}/>
              <DeleteAuctionButton auctionId={data.id}/>          
            </>
          )}
          
        </div>
        <div>
          <h3 className='text-2xl font-semibold'>Time remaining:</h3>
          <CountdownTimer auctionEnd={data.auctionEnd}/>
        </div>

      </div>
      <div className='grid grid-cols-2 gap-6 mt-3'>
        <div className='w-full bg-gray-200 rounded-lg overflow-hidden'>
          <AspectRatio ratio={16 / 10}>
            <CarImage 
              imageUrl={data.imageUrl} />
          </AspectRatio>
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
