import AuctionCard from "./AuctionCard";
import {Auction, PageResult} from "@/types";

async function getData(): Promise<PageResult<Auction>>{
    const res = await fetch('http://localhost:6001/search?pageSize=10');

    if (!res.ok) throw new Error("Failed to fetch data")
    return res.json();
}

const Listings = async () => {
    const data = await getData();    
    
    return (
            <div className="grid grid-cols-4 gap-6">
                {data && data.results.map(auction => (
                    <AuctionCard key={auction.id} auction={auction}/>
                ))}
            </div>
        );
}
export default Listings;