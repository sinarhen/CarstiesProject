'use client'


import AuctionCard from "./AuctionCard";
import {Auction, PageResult} from "@/types";
import AppPagination from "@/components/AppPagination";
import {useEffect, useState} from "react";
import {getData} from "@/app/actions/auctionActions";
import Filters from "@/components/Filters";
import {useParamsStore} from "@/hooks/useParamsStore";
import {shallow} from "zustand/shallow";
import qs from 'query-string';

const Listings = () => {

  const [data, setData] = useState<PageResult<Auction>>();
  const params = useParamsStore(state => ({
    pageNumber: state.pageNumber,
    pageSize: state.pageSize,
    searchTerm: state.searchTerm,
    orderBy: state.orderBy,
  }), shallow);


  const setParams = useParamsStore(state => state.setParams);
  const url = qs.stringifyUrl({url: '', query: params});

  function setPageNumber(pageNumber: number){
    setParams({pageNumber})
  }
  useEffect(() => {
    getData(url).then(data => {
        setData(data);
      }
    );
  }, [url]);

  if (!data) return <h3>Loading...</h3>

  return (
    <>
      <Filters />

      <div className="grid grid-cols-4 gap-6">
        {data.results.map(auction => (
          <AuctionCard key={auction.id} auction={auction}/>
        ))}
      </div>
      <div className='flex gap-4 items-center justify-center mt-14'>
        <AppPagination pageChanged={setPageNumber}
                       page={params.pageNumber}
                       pageCount={data.pageCount}/>

      </div>
    </>
  );
}
export default Listings;