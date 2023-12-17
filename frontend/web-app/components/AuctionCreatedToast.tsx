import { Auction } from '@/types'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

type Props = {
    auction: Auction;
}

export default function AuctionCreatedToast({auction}: Props) {
  return (
    <Link
        className='flex flex-col items-center' 
        href={`/auctions/details/${auction.id}`}
    >
        <div className='flex flex-row gap-4'>
                <Image
                    src={auction.imageUrl}
                    alt="Image"
                    width={128}
                    height={80}
                    className='rounded-lg w-auto h-auto'
                />
            
            <span className='mt-1'>
                New Auction! {auction.make} {auction.model} has been added
            </span>
        </div>
    </Link>
  )
}
