'use client';
import { useBidStore } from '@/hooks/useBidStore';
import { usePathname } from 'next/navigation';
import React from 'react'

import Countdown, {zeroPad} from 'react-countdown';
type CountdownTimerProps = {
    auctionEnd: string;    
}


// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
    
}) => {

    return (
        <div className={` 
            text-white py-1 px-2 
            rounded-lg flex justify-center
            backdrop-filter backdrop-blur-sm
            bg-opacity-80 
            border
            ${completed ? 
                'bg-red-800 border-red-900' : (days == 0 && hours < 10) ? 'bg-amber-800 border-amber-900' : 'bg-green-800 border-green-900'}
        `}>
           {completed ? (
            <span>Auction finished</span>
           ):  (
            <span suppressHydrationWarning>{zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>
           )} 
        </div>
    )
  };

const CountdownTimer: React.FC<CountdownTimerProps> = ({auctionEnd}) => {
    
    
    const setOpen = useBidStore(state => state.setOpen);

    const open = useBidStore(state => state.open);
    console.log(open)
    const pathname = usePathname();

    function auctionFinished() {
        if (pathname.startsWith('/auctions/details')) {
            setOpen(false);
        }
    }
    
    return (
        <div className='flex'>
            <Countdown renderer={renderer} onComplete={auctionFinished} date={auctionEnd}/>
        </div>
    )
}

export default CountdownTimer;