'use server'

import {Auction, PageResult, TCreateAuctionFormSchema, TEditAuctionFormSchema} from "@/types";
import { fetchWrapper } from "@/lib/fetchWrapper";

export async function getData(query: string): Promise<PageResult<Auction>>{
  return await fetchWrapper.get('search' + query);
}


export async function updateAuctionTest() {
  const data = {
    mileage: Math.floor(Math.random() * 100000) + 1
  }

  return await fetchWrapper.put('auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c', data)

}

export type Error = {
  error: {
    status: number,
    message: string
  }
}

export async function getAuction(id: string): Promise<Auction> {
  return await fetchWrapper.get('auctions/' + id);
}

export async function createAuction(auction: TCreateAuctionFormSchema) {
  return await fetchWrapper.post('auctions/', auction);
}

export async function updateAuction(id: string, auction: TEditAuctionFormSchema) {
  return await fetchWrapper.put('auctions/' + id, auction);
}

export async function deleteAuction(id: string) {
  return await fetchWrapper.delete('auctions/' + id);
}