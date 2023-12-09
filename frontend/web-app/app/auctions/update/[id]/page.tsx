import React from 'react';

function Page({params}: {
  params: {
    id: string;
  }
}) {
  return (
    <div>
      Update for {params.id}

    </div>
  );
}

export default Page;