'use client'

import React, {useState} from 'react';

type AppPaginationProps = {
  page: number;
  pageCount: number;
  pageChanged: (page: number) => void;
}

const AppPagination : React.FC<AppPaginationProps> = ({
                                                        page,
                                                        pageCount,
                                                        pageChanged
                                                      })  => {
  const nextPage = page + 1
  const prevPage = page - 1

  const pageNumbers = []
  const offsetNumberLeft = 2;
  const offsetNumberRight = 5;

  for (let i = page - offsetNumberLeft; i <= page + offsetNumberRight; i++) {
    if (i >= 1 && i <= pageCount) {
      console.log(`Page ${i} is lower than ${pageCount}`)
      pageNumbers.push(i);
    }
  }
  return (
  <>

      <div className="flex justify-center items-center">
        <div className="flex border-[1px] gap-4 rounded-[10px] border-light-green p-4">
          {page === 1 ? (
            <div className="opacity-60" aria-disabled="true">
              Previous
            </div>
          ) : (
            <button onClick={() => pageChanged(prevPage)}  aria-label="Previous Page">
              Previous
            </button>
          )}

          {pageNumbers.map((pageNumber, index) => (
            <button
              key={index}
              className={
                page === pageNumber
                  ? "bg-gray-200 fw-bold px-2 rounded-md text-black"
                  : "hover:bg-gray-100 hover:border-b-1 transition-colors px-2 rounded-md"
              }
              onClick={() => pageChanged(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          {page === pageCount ? (
            <div className="opacity-60" aria-disabled="true">
              Next
            </div>
          ) : (
            <button onClick={() => pageChanged(nextPage)} className='hover:opacity-60 transition-opacity' aria-label="Next Page">
              Next
            </button>
          )}
        </div>
      </div>

  </>
    );
}

export default AppPagination;