'use client';

import React, { FunctionComponent } from 'react';
import {useParamsStore} from "@/hooks/useParamsStore";
import Heading from "@/components/Heading";
import {Button} from "antd";
import {signIn} from "next-auth/react";

type Props = {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
  showLogin?: boolean;
  callbackUrl?: string;
};

const EmptyFilter: FunctionComponent<Props> = ({
  title = "No matches for this filter",
  subtitle = 'Try changing or resetting the filter',
  showReset ,
  showLogin,
  callbackUrl
                                               }) => {
  const reset = useParamsStore(state => state.reset);

  return (
    <div className='h-[40vh] flex flex-col gap-2 justify-center items-center shadow-lg'>
      <Heading title={title} subtitle={subtitle} center/>
      <div className='mt-4'>
        {showReset && (
          <Button onClick={reset} className=''>
            Reset
          </Button>
        )}
        {showLogin && (
          <Button color="red" size="large" onClick={() => signIn('id-server', {callbackUrl})}>
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyFilter;
