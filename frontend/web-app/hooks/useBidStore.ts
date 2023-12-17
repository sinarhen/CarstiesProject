import { Bid } from "@/types"
import { create } from "zustand";

type State = {
    bids: Bid[];
    open: boolean;
}

type Actions = {
    setBids: (bids: Bid[]) => void;
    addBid: (bid: Bid) => void;
    setOpen: (value: boolean) => void;
}

export const useBidStore = create<State & Actions>((set) => ({
    open: true,
    bids: [],

    setBids: (bids) => set({ bids }),
    addBid: (bid) => set((state) => ({ 
        bids: !state.bids.find(x => x.id === bid.id) 
            ? [bid, ...state.bids] 
            : [...state.bids]
        })),
    setOpen: (value) => set({ open: value }),
    }));
