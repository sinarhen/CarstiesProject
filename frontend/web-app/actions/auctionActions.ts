'use server'

import {Auction, Bid, PageResult, TCreateAuctionFormSchema, TEditAuctionFormSchema} from "@/types";
import { fetchWrapper } from "@/lib/fetchWrapper";
import axios from "axios";
import { revalidatePath } from "next/cache";

export async function getData(query: string): Promise<PageResult<Auction>>{
  const res = await fetchWrapper.get('search' + query);
  revalidatePath('/');
  return res;
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

export async function uploadImage(file: string | Blob) {
  const formData = new FormData();
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
  formData.append('api_secret', process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!);
  
  return
}

export async function getAuction(id: string): Promise<Auction> {
  return await fetchWrapper.get('auctions/' + id);
}

export async function createAuction(auction: TCreateAuctionFormSchema) {
  const res = fetchWrapper.post('auctions/', auction);
  revalidatePath('/');
  return res;
}

export async function updateAuction(id: string, auction: TEditAuctionFormSchema) {
  const res = await fetchWrapper.put('auctions/' + id, auction);
  revalidatePath(`/auctions/details/${id}`);
  return res;
}

export async function deleteAuction(id: string) {
  const res = await fetchWrapper.delete('auctions/' + id);
  revalidatePath(`/auctions/details/${id}`);
  return res
}

export async function getBidsForAuction(id: string): Promise<Bid[]> {
  const res =  await fetchWrapper.get(`bids/${id}`);
  revalidatePath(`/auctions/details/${id}`);
  return res;
}

export async function placeBidForAuction(auctionId: string, amount: number) {
  const result = await fetchWrapper.post(`bids?auctionId=${auctionId}&amount=${amount}`, {
    
  });
  revalidatePath(`/auctions/details/${auctionId}`);
  return result;
}