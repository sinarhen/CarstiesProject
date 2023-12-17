import { numberWithCommas } from '@/lib/utils';
import { Auction, AuctionFinished } from '@/types'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

type Props = {
    auction: Auction;
    finishedAuction: AuctionFinished;
}

export default function AuctionFinishedToast({auction, finishedAuction}: Props) {
  return (
    <Link
        className='flex flex-col items-center' 
        href={`/auctions/details/${auction?.id}`}
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
                Auction finished! {auction.make} {auction.model}
                {finishedAuction?.itemSold && finishedAuction.amount ? (
                    <p>
                        Congrats to {finishedAuction.winner} 
                        who has won this auction for ${numberWithCommas(finishedAuction.amount)}.
                    </p>
                ): (
                    <p>
                        This item did not sell.
                    </p>
                )}
            </span>
        </div>
    </Link>
  )
}
