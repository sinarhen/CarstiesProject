import { createWithEqualityFn } from "zustand/traditional";
import { Auction, PageResult } from "@/types";

type State = {
    auctions: Auction[]
    totalCount: number
    pageCount: number;
}

type Actions = {
    setData: (data: PageResult<Auction>) => void
    setCurrentPrice: (auctionId: string, amount: number) => void
}

const initialState: State = {
    auctions: [],
    pageCount: 0,
    totalCount: 0
}

export const useAuctionStore = createWithEqualityFn<State & Actions>((set) => ({
    ...initialState,
    setData: (data: PageResult<Auction>) => {
        set({
            auctions: data.results,
            pageCount: data.pageCount,
            totalCount: data.pageCount
        })
    },
    setCurrentPrice: (auctionId: string, amount: number) => {
        set((state) => ({
            auctions: state.auctions.map(auction => auction.id === auctionId 
                ? { ...auction, currentHighBid: amount } 
                : auction)
        }))

    }
}))