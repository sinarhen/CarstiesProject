'use client';

import { getBidsForAuction } from '@/actions/auctionActions';
import { useBidStore } from '@/hooks/useBidStore';
import { Auction, Bid } from '@/types';
import { User } from 'next-auth';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import BidItem from './BidItem';
import BidForm from './BidForm';
import Heading from '@/components/Heading';
import { numberWithCommas } from '@/lib/utils';
import EmptyFilter from '@/components/EmptyFilter';
import { motion } from 'framer-motion';


type Props = {
    user: User | null;
    auction: Auction;
}



export default function BidList({user, auction}: Props) {
    const [loading, setLoading] = useState(true);
      const bids = useBidStore(state => state.bids);
    const highBid = bids ? bids.reduce((prev, current) => (
        prev > current.amount) 
        ? prev 
        : current.bidStatus.includes("Accepted") 
        ? current.amount
        : prev, 0) : 0;
    
    const setBids = useBidStore(state => state.setBids);
    useEffect(() => {
        getBidsForAuction(auction.id)
            .then((res: any) => {
                if (res.error) {
                    throw res.error
                }
                setBids(res as Bid[]);
            }).catch(err => {
                toast.error(err.message);
            }).finally(() => setLoading(false))
    }, [auction.id, setLoading, setBids])

    const open = useBidStore(state => state.open);
    const setOpen = useBidStore(state => state.setOpen);

    const openForBids = new Date(auction.auctionEnd) > new Date();
    useEffect(() => {
        setOpen(openForBids);
    }, [openForBids, setOpen])
    if (loading){
         return <span>Loading...</span>
    }
return (
    <div className='rounded-lg shadow-md'>
        <div className='py-2 px-4 bg-white'>
            <div className='sticky top-0 p-2 bg-white'>
                  <Heading title={`Current high bid is $${numberWithCommas(highBid)}`}/>

            </div>
        </div>
        <div className='overflow-auto h-[400px] flex flex-col-reverse px-2'>
            {bids.length !== 0 ? 
            (   <>
                {/* <AnimatePresence> */}
                    {bids.map((bid, index) => (
                    <motion.div
                        key={bid.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ 
                            opacity: 1, 
                            y: [0, -10, 5, -2.5, 1.25, 0] }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ 
                            delay: index * 0.1,
                            duration: 0.5,
                            x: { type: "spring", stiffness: 500, damping: 30 } // spring physics for shaking animation
                        }}
                    >
                        <BidItem bid={bid} />
                    </motion.div>
                    ))}
                    {/* </AnimatePresence> */}
                </>

            ): 
            <EmptyFilter 
                title="No bids for this item" 
                subtitle={!user ? "Please feel free to login and place a bid" : user?.username == auction.seller ? "": "Please feel free to make a bid"}/>
                
            }
            
        </div>
        <div className='mb-8 mt-1.5 px-1.5'>
            {!open ? (
                <div className='text-center'>
                    <span className='text-gray-400'>
                        Bidding is closed for this auction
                    </span>
                </div>
            ): !user ? (
                <div className='text-center'>
                    <span className='text-gray-400'>
                        Please log in to place a bid
                    </span>
                </div>
            ): user.username === auction.seller ? (
                <div className='text-center'>
                    <span className='text-gray-400'>You cannot bid on your own auction</span>
                </div>
            ):
                <BidForm auctionId={auction.id} highBid={auction.currentHighBid} />

            }

        </div>
    </div>
  )
}
