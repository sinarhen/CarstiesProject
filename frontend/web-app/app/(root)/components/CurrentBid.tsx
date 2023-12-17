import React from 'react'

type Props = {
    amount?: number;
    reservePrice: number;
}

export default function CurrentBid({amount, reservePrice}: Props) {
    const text = amount ? "$" + amount : "No bids";
    const color = amount ? amount > reservePrice ? "bg-green-800 border-green-900" : 'bg-amber-800 border-amber-900' : "bg-red-800 border-red-900"
    return (
        <div className={`
            text-white
            py-1 
            px-2 rounded-lg 
            text-sm
            bg-opacity-70
            backdrop-blur-sm
            border
            flex justify-center ${color}
        `}>
            {text}
        </div>
  )
}
