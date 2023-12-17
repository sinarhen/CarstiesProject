import React from 'react';
import {useParamsStore} from "@/hooks/useParamsStore";
import {AiOutlineClockCircle, AiOutlineSortAscending} from "react-icons/ai";
import {BsFillStopCircleFill, BsStopwatchFill} from "react-icons/bs";
import {GiFinishLine, GiFlame} from "react-icons/gi";
import {Button} from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

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
        <ToggleGroup type='single'>
          {orderButtons.map(({label, value, icon: Icon}, i) => (
            <ToggleGroupItem
              value={value}
              key={i} // Added a key prop for each button
              onClick={() => setParams({orderBy: value})}
            >
              <p className='flex items-center gap-2'>
                <Icon />
                {label}

              </p>
            </ToggleGroupItem>
          ))}

        </ToggleGroup>

      </div>
      <div className='flex items-center'>
        <span className='uppercase text-sm text-gray-500 mr-2'>Order by</span>
          <ToggleGroup type="single">
            {filterButtons.map(({label, value, icon: Icon}, i) => (
              <ToggleGroupItem
                value={value}
                key={i} // Added a key prop for each button
                onClick={() => setParams({filterBy: value})}
              >
                <p className='flex items-center gap-2'>
                  <Icon />
                  {label}

                </p>
              </ToggleGroupItem>

            ))}

          </ToggleGroup>

       </div>
      <div className=''>
        <span className='uppercase text-sm text-gray-500 mr-2'>Items</span>
          <ToggleGroup type="single">
            {pageSizeButtons.map((pageSizeButton, i) => (
              <ToggleGroupItem
                value={`${pageSizeButton}`}
                key={i} // Added a key prop for each button
                onClick={() => setParams({pageSize: pageSizeButton})}

              >
                {pageSizeButton}
              </ToggleGroupItem>
            ))}

          </ToggleGroup>
       </div>
    </div>
  );
};

export default Filters;
