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



import DatePicker from 'react-datepicker';
import { createAuction } from '@/app/actions/auctionActions';
import { TCreateAuctionFormSchema, createAuctionFormSchema } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';




const AuctionForm = () => {
  const router = useRouter();

  const form = useForm<TCreateAuctionFormSchema>({
    resolver: zodResolver(createAuctionFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: 2023,
      mileage: 0,
      color: "Black",

    },
    mode: "onTouched",
  });

  async function onSubmit(values: TCreateAuctionFormSchema) {
        const res = await createAuction(values);
        console.log(res)
        if (res?.error) {
          toast.error(res.error.message || "Something went wrong");
          return;
        }
        router.push(`/auctions/details/${res?.id}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="gap-x-4 gap-y-8 grid grid-cols-12">
        <FormField
          control={form.control}
          name="make"
          render={({ field }) => (
            <FormItem className='col-span-6'>
              <FormLabel>Make</FormLabel>
              <FormControl>
                <Input placeholder="Make" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem className='col-span-6'>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input placeholder="Model" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem className="col-span-3">
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
            <FormItem className='col-span-3'>
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
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem className='col-span-6'>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="paste your URL here..." {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription >
                Should be a valid URL
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          
          render={({ field }) => (
            <FormItem className='col-span-2'>
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
          name="reservePrice"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>Reserve price</FormLabel>

              <FormControl>
                <Input 
                  {...field}
                  type='number'
                  onChange={e => field.onChange(e.target.valueAsNumber)}

                  placeholder="Reserve Price"
                />    
              </FormControl>
              <FormDescription>
                Reserve price
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
                <FormField
          control={form.control}
          name="auctionEnd"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>End of auction</FormLabel>

              <FormControl>
                  
                  
                    <div>
                    <DatePicker
                    {...field}
                    onChange={field.onChange}
                    selected={field.value}
                    placeholderText={"Auction End Date"}
                    value={field.value} 
                    dateFormat="dd MMMM yyyy h:mm aa"
                    showTimeSelect
                    className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-sm  focus:border-transparent'
                  />
                    
                    </div>
              </FormControl>
              <FormDescription>
                Auction will end at this date
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='col-span-12 flex items-center'>
          <Button isLoading={form.formState.isLoading || form.formState.isValidating } type="submit" >Submit</Button>
          <Button className='ml-4'  type="submit" variant='destructive'>Cancel</Button>

        </div>
        
      </form>
    </Form>

  )
}

export default AuctionForm;