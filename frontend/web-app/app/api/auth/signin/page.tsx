import React, { FunctionComponent } from 'react';
import EmptyFilter from "@/components/EmptyFilter";

const Page = (searchParams: {callbackUrl: string}) => {

  return (
    <EmptyFilter
      title={"You need to be logged to do that"}
      subtitle={"Please click below to sign in "}
      showLogin={true}
      callbackUrl={searchParams.callbackUrl}

    />
  );
};

export default Page;
