import type { FC } from 'react';

import CountdownTimer from '@/components/auctions/CountdownTimer';
import CarImage from '@/components/auctions/CarImage';
import { Auction } from "@/types";
import React from "react";
import Link from "next/link";

interface AuctionCardProps {
    auction: Auction;
}

const AuctionCard: FC<AuctionCardProps> = ({
    auction,
}) => {

        return (
            <Link href={`/auctions/details/${auction.id}`} className="group">
                <div className='w-full relative bg-gray-200 overflow-hidden rounded-lg'>
                    <CarImage  imageUrl={auction.imageUrl}/>
                    <div className='absolute bottom-2 left-2'>
                        <CountdownTimer auctionEnd={auction.auctionEnd}/>
                    </div>
                    
                </div>
                <div className='flex justify-between items-center mt-4'>
                    <h3 className='text-grat-700'>{auction.make} {auction.model}</h3>
                    <p className='font-semibold text-sm'>{auction.year}</p>
                </div>
            </Link>
        );
}

export default AuctionCard;