import React, { FunctionComponent } from 'react';
import {useParamsStore} from "@/hooks/useParamsStore";
import Heading from "@/components/Heading";

type Props = {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
};

const EmptyFilter: FunctionComponent<Props> = ({
  title = "No matches for this filter",
  subtitle = 'Try changing or resetting the filter',
  showReset = true
                                               }) => {
  const reset = useParamsStore(state => state.reset);

  return (
    <div className='h-[40vh] flex flex-col gap-2 justify-center items-center shadow-lg'>
      <Heading title={title} subtitle={subtitle} center/>
      <div className='mt-4'>
        {showReset && (
          <button onClick={reset} className=''>
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyFilter;
