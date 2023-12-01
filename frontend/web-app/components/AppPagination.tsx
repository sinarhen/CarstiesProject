'use client'

import React, {useState} from 'react';
import {Pagination} from "flowbite-react";

type AppPaginationProps = {
  currentPage: number;
  pageCount: number;
}

const AppPagination : React.FC<AppPaginationProps> = ({
                                                        currentPage,
                                                        pageCount,
                                                      })  => {
  const [pageNumber, setPageNumber] = useState(currentPage);

  return (
      <Pagination
        currentPage={0}
        onPageChange={(e) => {setPageNumber(e)}}
        totalPages={pageCount}
        layout='pagination'
        showIcons={true}
        className='text-blue-500 mb-5'
/>
    );
}

export default AppPagination;