import React from 'react';
import {useParamsStore} from "@/hooks/useParamsStore";
import {AiOutlineCheck, AiOutlineClockCircle, AiOutlineSortAscending} from "react-icons/ai";
import {BsFillStopCircleFill, BsStopwatchFill} from "react-icons/bs";
import {GiFinishLine, GiFlame} from "react-icons/gi";

const pageSizeButtons = [4, 8, 12];
const orderButtons = [
  {
    label: "Alphabetical",
    icon: AiOutlineSortAscending,
    value: 'make'
  },
  {
    label: "End date",
    icon: AiOutlineClockCircle,
    value: 'endingSoon'
  },
  {
    label: "Recently added",
    icon: BsFillStopCircleFill,
    value: 'new'
  },
]
const filterButtons = [
  {
    label: "Live auctions",
    icon: GiFlame,
    value: 'live'
  },
  {
    label: "Ending < 6 hours",
    icon: GiFinishLine,
    value: 'endingSoon'
  },
  {
    label: "Complete",
    icon: BsStopwatchFill,
    value: 'finished'
  },
]

const Filters = () => {
  const setParams = useParamsStore(state => state.setParams);
  const pageSize = useParamsStore(state => state.pageSize);
  const orderBy = useParamsStore(state => state.orderBy);
  const filterBy = useParamsStore(state => state.filterBy);

  return (
    <div className='flex w-full justify-between items-center mb-4'>
      <div className='flex items-center '>
        <span className='uppercase text-sm text-gray-500 mr-2'>Order by</span>
        {orderButtons.map(({label, value, icon: Icon}, i) => (
          <button
            key={i} // Added a key prop for each button
            onClick={() => setParams({orderBy: value})}
            className={`
                px-4 flex items-center gap-x-2 font-medium py-1 text-gray-700 border-r border-t border-b  
                ${i === 0 ? 'rounded-l-2xl border-l' : i === orderButtons.length - 1 ? 'rounded-r-2xl' : ''}  
                ${orderBy === value ? 'bg-gray-200' : 'bg-gray-50 hover:bg-gray-100'}
              `}
          >
            <Icon />
            {label}
          </button>

        ))}
      </div>
      <div className='flex items-center'>
        <span className='uppercase text-sm text-gray-500 mr-2'>Order by</span>
        {filterButtons.map(({label, value, icon: Icon}, i) => (
          <button
            key={i} // Added a key prop for each button
            onClick={() => setParams({filterBy: value})}
            className={`
                px-4 flex items-center gap-x-2 font-medium py-1 text-gray-700 border-r border-t border-b  
                ${i === 0 ? 'rounded-l-2xl border-l' : i === filterButtons.length - 1 ? 'rounded-r-2xl' : ''}  
                ${filterBy === value ? 'bg-gray-200' : 'bg-gray-50 hover:bg-gray-100'}
              `}
          >
            <Icon />
            {label}
          </button>

        ))}
      </div>
      <div className=''>
        <span className='uppercase text-sm text-gray-500 mr-2'>Items</span>
        {pageSizeButtons.map((pageSizeButton, i) => (
          <button
            key={i} // Added a key prop for each button
            onClick={() => setParams({pageSize: pageSizeButton})}
            className={`
                p-3.5 text-gray-700 font-medium border-r border-t border-b  
                ${i === 0 ? 'rounded-l-2xl border-l' : i === pageSizeButtons.length - 1 ? 'rounded-r-2xl' : ''}  
                ${pageSize === pageSizeButton ? 'bg-gray-200' : 'bg-gray-50 hover:bg-gray-100'}
              `}
          >
            {pageSizeButton}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filters;
