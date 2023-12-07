'use client';

import React, {useState} from 'react';
import {UpdateAuctionTest} from "@/app/actions/auctionActions";
import {Button} from "antd";

function AuthTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>();

  function doUpdate(){
    setResult(undefined);
    setIsLoading(true);
    UpdateAuctionTest().
      then(res => setResult(res))
      .finally(() => setIsLoading(false))
  }
  return (
    <div className='flex items-center gap-4 '>
      <Button loading={isLoading} onClick={doUpdate}>
        Test auth
      </Button>
      <div>
        {JSON.stringify(result, null, 2)}
      </div>
    </div>
  );
}

export default AuthTest;