'use client';
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
            border-2 
            border-white 
            text-white py-1 px-2 
            rounded-lg flex justify-center
            ${completed ? 
                'bg-red-700' : (days == 0 && hours < 10) ? 'bg-amber-700' : 'bg-green-700'}
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
    return (
        <div className='flex'>
            <Countdown renderer={renderer} date={auctionEnd}/>

        </div>
    )
}

export default CountdownTimer;