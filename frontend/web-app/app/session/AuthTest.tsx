'use client';

import React, {useState} from 'react';
import {updateAuctionTest} from "@/actions/auctionActions";
import {Button} from "@/components/ui/button";

function AuthTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>();

  function doUpdate(){
    setResult(undefined);
    setIsLoading(true);
    updateAuctionTest().
      then(res => setResult(res))
      .finally(() => setIsLoading(false))
  }
  return (
    <div className='flex items-center gap-4 '>
      <Button onClick={doUpdate}>
        Test auth
      </Button>
      <div>
        {JSON.stringify(result, null, 2)}
      </div>
    </div>
  );
}

export default AuthTest;