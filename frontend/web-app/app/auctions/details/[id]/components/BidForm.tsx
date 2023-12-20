'use client'

import { constructPlaceBidFormSchema } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { placeBidForAuction } from '@/actions/auctionActions';
import toast from 'react-hot-toast';
import { useBidStore } from '@/hooks/useBidStore';


type Props = {
  auctionId: string;
  highBid: number;
}

export default function BidForm({ auctionId, highBid }: Props) {

  const constructSchema = useCallback(() => constructPlaceBidFormSchema(highBid), [highBid]);
  const formSchema = constructSchema();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: highBid + 1,
    },
    reValidateMode: 'onBlur',
  }
  )
  const addBid = useBidStore(state => state.addBid);
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    placeBidForAuction(auctionId, +data.amount).then(bid => {
      if (bid.error) throw bid.error;
      addBid(bid);
      toast.success('Bid placed successfully');
    }).catch(err => toast.error(err.status))
  };

  useEffect(() => { 
    form.setValue('amount', highBid + 50);
  }, [highBid, form])
  
  useEffect(() => {
    if (form.formState.errors.amount) 
      {
        toast.error('Please enter a valid bid amount', {id: 'bid-form-error'});
      }
  }, [form.formState.errors.amount])
  return (
      <form onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          form.handleSubmit(onSubmit)();
        }
      }} onSubmit={form.handleSubmit(onSubmit)}>
          <div className=''>
            <div className='w-full'>
              <div className='relative mt-1'>
                <Input 
                  className='w-full h-14'
                  placeholder="Bid amount"
                  type='number'
                  {...form.register('amount', { valueAsNumber: true })}
                  onChange={(e) => {
                    form.setValue('amount', e.target.valueAsNumber)
                  }
                  }  
                />
                <span className='absolute right-2 top-4 text-gray-400'>$</span>

              </div>

              
              </div>
              <Button disabled={ form.formState.isSubmitting || form.formState.isLoading || !form.formState.isValid } className='bg-green-800 w-full mt-1.5 hover:bg-green-900 border-green-900 border ' type="submit">Submit</Button>

          </div>
              {form.formState.errors.amount && (
                <span className='text-red-500 font-medium text-sm'>
                  {form.formState.errors.amount.message}
                </span>
              )}

      </form>
  )
}
