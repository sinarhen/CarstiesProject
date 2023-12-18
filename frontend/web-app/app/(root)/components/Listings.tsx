'use client'

import AuctionCard from "./AuctionCard";
import {Auction, PageResult} from "@/types";
import {useEffect, useState} from "react";
import {getData} from "@/actions/auctionActions";
import Filters from "@/app/(root)/components/Filters";
import {useParamsStore} from "@/hooks/useParamsStore";
import {shallow} from "zustand/shallow";
import qs from 'query-string';
import EmptyFilter from "@/components/EmptyFilter";
import AppPagination from "@/app/(root)/components/AppPagination";
import toast from "react-hot-toast";
import { useAuctionStore } from "@/hooks/useAuctionStore";
import { AnimatePresence, motion } from "framer-motion";
import { time } from "console";
import { cn } from "@/lib/utils";

const Listings = () => {
  const [loading, isLoading] = useState(true)
  const params = useParamsStore(state => ({
    pageNumber: state.pageNumber,
    pageSize: state.pageSize,
    searchTerm: state.searchTerm,
    orderBy: state.orderBy,
    filterBy: state.filterBy,
    seller: state.seller,
    winner: state.winner,
  }), shallow);

  const data = useAuctionStore(state => ({
    results: state.auctions,
    totalCount: state.pageCount,
    pageCount: state.totalCount,
  }), shallow);

  const setData = useAuctionStore(state => state.setData);
  const setParams = useParamsStore(state => state.setParams);
  const url = qs.stringifyUrl({url: '', query: params});
  
  function setPageNumber(pageNumber: number) {
    setParams({pageNumber})
  }
  
  const transitionDuration = 0.2;
  const delayPerItem = 0.05;
  
  const [isUpdating, setIsUpdating] = useState(false);
  const previousPageSize = data?.results?.length - 1 ?? 0;

  useEffect(() => {
    const delayBetweenUpdate = 1000 * 0.5;
    setIsUpdating(true);
    
    const timeoutId = setTimeout(() => {
      getData(url)
        .then(res => {
          setData(res);
          setIsUpdating(false);
        })
        .catch(err => toast.error("Something went wrong, please try again later", { id: 'listings' }))
        .finally(() => isLoading(false));
    }, transitionDuration * (previousPageSize * (delayPerItem + transitionDuration)) + delayBetweenUpdate);
    
    return () => clearTimeout(timeoutId);
  }, [url, previousPageSize, setData]);


  if (loading) return <h3>Is loading...</h3>

  return (
    <>
      <Filters/>
      {data.pageCount === 0 ? <EmptyFilter showReset /> :
        (
          <>
            <div className="grid grid-cols-4 gap-6">
            <AnimatePresence>
            {!isUpdating && data?.results?.map((auction, index) => (
              <motion.div
                key={auction.id + params.orderBy + params.filterBy + params.searchTerm + params.pageSize + params.pageNumber}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * delayPerItem, duration: transitionDuration }}
              >
                <AuctionCard key={auction.id} auction={auction} />
              </motion.div>
            ))}
          </AnimatePresence>

            </div>
            <div className={cn(`flex gap-4 items-center justify-center transition-opacity mt-14 duration-1000 opacity-100 `, isUpdating ? "opacity-0" : "")}>
              
                          <AppPagination pageChanged={setPageNumber}
                             page={params.pageNumber}
                             pageCount={data?.pageCount ?? 1}
                             
              />
              
              
            </div>
          </>
        )

      }
    </>
  )
    ;
}
export default Listings;