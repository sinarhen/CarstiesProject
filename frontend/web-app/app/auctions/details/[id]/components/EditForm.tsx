'use client';

import React from 'react';
import { useForm} from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import 'react-datepicker/dist/react-datepicker.css'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl, FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


import { zodResolver } from "@hookform/resolvers/zod";

const currentYear = new Date().getFullYear();

import { Auction, TEditAuctionFormSchema, editAuctionFormSchema } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { updateAuction } from '@/app/actions/auctionActions';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';




const AuctionForm = ({initialValues} : {
  initialValues: Auction
}) => {
  const router = useRouter();

  const form = useForm<TEditAuctionFormSchema>({
    resolver: zodResolver(editAuctionFormSchema),
    defaultValues: {
      make: initialValues.make,
      model: initialValues.model,
      year: initialValues.year,
      mileage: initialValues.mileage,
      color: initialValues.color,
    },
    mode: "onTouched",
  });

  async function onSubmit(values: TEditAuctionFormSchema) {
        const res = await updateAuction(initialValues.id, values);
        console.log(res)
        if (res?.error) {
          toast.error(res.error.message || "Something went wrong");
          return;
        }
        router.refresh();
        toast.success("Auction updated successfully");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <FormField
          control={form.control}
          name="make"
          render={({ field }) => (
            <FormItem className='col-span-12'>
              <FormLabel>Make</FormLabel>
              <FormControl>
                <Input placeholder="Make" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Make of the car
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem className='col-span-12'>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input placeholder="Model" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Model of the car
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="color"
          
          render={({ field }) => (
            <FormItem className='col-span'>
              <FormLabel>Color</FormLabel>
              <FormControl >
                <Input { ...field }/>
              </FormControl>
              <FormDescription>
                Color of the car
              </FormDescription>
              <FormMessage />

            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem className='col-span-6'>
              <FormLabel>Year</FormLabel>
                <FormControl>
                  <Select>
                        <SelectTrigger className='mt-0'>
                          <SelectValue className='mt-0' placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {new Array(currentYear - 1886).fill(0)
                            .map((_, i) => (
                              <SelectItem value={`${currentYear - i}`}>
                                {currentYear - i}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    
                </FormControl>
                <FormDescription>
                Year of car creation
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          
          control={form.control}
          name="mileage"
          render={({ field }) => (
            <FormItem className='col-span-12'>
              <FormLabel>Mileage</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input 
                  {...field}
                  type='number' 
                  onChange={e => field.onChange(e.target.valueAsNumber)} 
                  placeholder="Mileage"  />
                  <span className='absolute right-8 text-xs top-3 text-gray-400'>km</span>
                </div>


              </FormControl>
              <FormMessage />
              <FormDescription>
                Mileage in km
              </FormDescription>
            </FormItem>
          )}
        />    
        <DialogFooter>
          <DialogClose asChild>
            <div className='mt-4 flex items-center'>
              <Button isLoading={form.formState.isLoading || form.formState.isValidating } type="submit" >Save Changes</Button>
              <Button className='ml-4'  type="submit" variant='destructive'>Cancel</Button>
            </div>
            
          </DialogClose>
          
        </DialogFooter>
        
      </form>
    </Form>

  )
}

export default AuctionForm;