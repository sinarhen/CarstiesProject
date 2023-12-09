import * as z from 'zod';

export interface PageResult<T> {
  results: T[];
  pageCount: number;
  pageSize: number;
}

const currentYear = new Date().getFullYear();

export const createAuctionFormSchema = z.object({
  make: z.string().min(1, "Make is required").max(50),
  model: z.string().min(1, "Model is required").max(50),
  year: z.number().min(1886, "First Car was created 1886!").max(currentYear),
  mileage: z.number().optional(),
  imageUrl: z.string().url(),
  color: z.string().min(1),
  auctionEnd: z.date().min(new Date(Date.now() + 24 * 60 * 60 * 1000), "Auction must be at least 24 hours in the future"),
  reservePrice: z.number().default(0),
});

export const editAuctionFormSchema = z.object({
  make: z.string().min(1, "Make is required").max(50),
  model: z.string().min(1, "Model is required").max(50),
  year: z.number().min(1886, "First Car was created 1886!").max(currentYear),
  mileage: z.number().optional(),
  color: z.string().min(1),
});

export type TCreateAuctionFormSchema = z.infer<typeof createAuctionFormSchema>;
export type TEditAuctionFormSchema = z.infer<typeof editAuctionFormSchema>;

export interface AuctionFormValues {
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  imageUrl: string;
  auctionEnd: string;
  reservePrice: number;
}

export interface Auction {
  reservePrice: number;
  seller: string;
  winner?: any;
  soldAmount: number;
  currentHighBid: number;
  createdAt: string;
  updatedAt: string;
  auctionEnd: string;
  status: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  imageUrl: string;
  id: string;
}