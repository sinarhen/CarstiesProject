'use client';

import React, { useEffect, useState } from 'react'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useAuctionStore } from '@/hooks/useAuctionStore';
import { useBidStore } from '@/hooks/useBidStore';
import { Auction, AuctionFinished, Bid } from '@/types';
import { User } from 'next-auth';
import toast from 'react-hot-toast';
import AuctionCreatedToast from '@/components/AuctionCreatedToast';
import { getAuction, getData } from '@/actions/auctionActions';
import AuctionFinishedToast from '@/components/AuctionFinishedToast';

type Props = {
    children: React.ReactNode
    user: User | null;
    environment: string;
}

export default function SignalRProvider({ children, user, environment }: Props) {    
  const [connection, setConnection] = useState<HubConnection | null>(null);
  
  const setCurrentPrice = useAuctionStore(state => state.setCurrentPrice);
  const setData = useAuctionStore(state => state.setData);
  const apiUrl = environment === 'production' 
    ? "https://api.carsties-app.com/notifications" 
    : process.env.NEXT_PUBLIC_NOTIFY_URL
  const addBid = useBidStore(state => state.addBid);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(apiUrl!)
      .withAutomaticReconnect()
      .build();
      
    setConnection(newConnection);
  }, [])

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
            connection.on("BidPlaced", (bid: Bid) => {
              if (bid.bidStatus.includes("Accepted")) {
                setCurrentPrice(bid.auctionId, bid.amount);
              }
              addBid(bid);
            })

            connection.on("AuctionCreated", (auction: Auction) => {
              if (user?.username !== auction.seller) {
                return toast(<AuctionCreatedToast auction={auction} />, {duration: 7000})
              }
            })

            connection.on("AuctionFinished", (finishedAuction: AuctionFinished) => {
              const auction = getAuction(finishedAuction?.auctionId)
                return toast.promise(auction, {
                  loading: "Loading",
                  success: (auction) => <AuctionFinishedToast 
                    auction={auction} 
                    finishedAuction={finishedAuction}
                  />,
                  error: (err) => "AuctionFinished",
                }, {success: {duration: 7000, icon: null}})
            })
          } 
        ).catch(err => console.log('Error while establishing connection :(\n error: ' + err));
    }
    return () => {
      if (connection) {
        connection.stop();
      }
    }
  }, [connection, setCurrentPrice, addBid, user?.username]);
  return children;
}
