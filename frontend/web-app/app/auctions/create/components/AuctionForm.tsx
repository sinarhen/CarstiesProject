'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import 'react-datepicker/dist/react-datepicker.css';


import { isValidURLImage } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { zodResolver } from '@hookform/resolvers/zod';

const currentYear = new Date().getFullYear();

import DatePicker from 'react-datepicker';
import { createAuction } from '@/actions/auctionActions';
import { TCreateAuctionFormSchema, createAuctionFormSchema } from '@/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CarImage from '@/components/CarImage';
import { Trash, Trash2 } from 'lucide-react';

const AuctionForm = () => {
  // State
  const [openImageUrlDialog, setOpenImageUrlDialog] = useState(false);
  const [imageUrlDialogTempInput, setImageUrlDialogTempInput] = useState('');
  const [inputType, setInputType] = useState<'file' | 'url'>('file');
  const [tempSrcUrlForFile, setTempSrcUrlForFile] = useState<string | null>(null);

  // Form
  const form = useForm<TCreateAuctionFormSchema>({
    resolver: zodResolver(createAuctionFormSchema),
    defaultValues: {
      make: '',
      model: '',
      year: 2023,
      mileage: 0,
      color: 'Black',
      imageUrl: '',
    },
    mode: 'onTouched',
  });

  // Router
  const router = useRouter();

  // Functions
  const toogleImageUrlDialog = () => {
    setOpenImageUrlDialog(!openImageUrlDialog);
  };

  const onSubmit = async (values: TCreateAuctionFormSchema) => {
    const formData = new FormData();
    if (inputType === 'file') {
      formData.append('file', values?.imageUrl);
      formData.append('upload_preset', 'gwuh0xnp');
      const imageUploaded = await axios.post(
        'https://api.cloudinary.com/v1_1/dhnkvzuxk/image/upload',
        formData
      );
      values.imageUrl = imageUploaded.data.secure_url;
    }

    const res = await createAuction(values);
    if (res?.error) {
      toast.error(res.error.message || 'Something went wrong');
      return;
    }
    router.push(`/auctions/details/${res?.id}`);
  };

  const setImageUrlFromFile = useCallback((file: File | null | undefined): void => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setTempSrcUrlForFile(reader.result as string);
    };
  }, [setTempSrcUrlForFile]);
  
  return (
    <>
    <Form {...form}>
      <form encType="multipart/form-data" onSubmit={form.handleSubmit(onSubmit)} className="gap-x-4 gap-y-8 grid grid-cols-12">
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
                  <Select onValueChange={(value) => {
                  try {
                    field.onChange(parseInt(value));
                  } catch (e) {
                    form.setError('year', {message: 'Invalid year'})
                  }

                }}>
                        <SelectTrigger className='mt-0'>
                          <SelectValue className='mt-0' placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent >
                          {new Array(currentYear - 1886).fill(0)
                            .map((_, i) => (
                              <SelectItem key={currentYear - i} value={`${currentYear - i}`}>
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
            <FormItem className='absolute'>
                <Dialog open={openImageUrlDialog} onOpenChange={() => {
                  toogleImageUrlDialog();
                  if (!form.getValues('imageUrl')) {
                    form.resetField('imageUrl');
                  }
                } }>
                  <DialogContent >
                    <DialogHeader>
                      <DialogTitle>
                        Paste URL 
                      </DialogTitle>
                      <DialogDescription>
                        Paste URL of image of your car below
                      </DialogDescription>
                      <FormControl>
                        <Input {...field} value={imageUrlDialogTempInput} onChange={(e) => setImageUrlDialogTempInput(e.target.value)}/>  
                      </FormControl>
                      <FormMessage/>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button 
                            disabled={!isValidURLImage(imageUrlDialogTempInput)}
                            onClick={() => {
                              field.onChange(imageUrlDialogTempInput);
                              setImageUrlDialogTempInput("");
                              setInputType("url");
                              setTempSrcUrlForFile(null);
                            }}
                          > 
                            Save
                          </Button>
                        
                        </DialogClose>
                      </DialogFooter>
                    </DialogHeader>


                  </DialogContent>

                </Dialog>
              
            </FormItem>
          )}
        >

        </FormField>
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem className='col-span-6'>
              <FormLabel>
                    Image

                    <span className='cursor-pointer right-0 ml-2 text-xs text-gray-400' onClick={toogleImageUrlDialog}>
                      Paste url
                    </span>

              </FormLabel>
              
              {
                (tempSrcUrlForFile || field.value) && (
                  <div className='w-full relative bg-gray-200 overflow-hidden rounded-lg'>
                    <CarImage  imageUrl={tempSrcUrlForFile ?? field.value}/>
                      
                  <span className='text-xs flex items-center justify-center absolute right-2 top-3 hover:bg-red-500 bg-white/30 transition-colors cursor-pointer backdrop-blur-sm w-9 h-9 rounded-lg border border-black' onClick={() => {
                    form.setValue('imageUrl', '');
                    if (inputType === 'file')
                    {
                    setTempSrcUrlForFile(null);
                      
                    } else if (inputType === 'url') {
                      setInputType('file');
                    }
                  }}>

                    <Trash2 className='w-1/2 h-1/2'/>                 
                  </span>
                </div>
                )
              }
              <FormControl className='block'>
                    <div className='block'>
                      <Input
                      style={{display: 'block'}}
                      multiple={false}
                      onChange={(e) => {
                        if (!e?.target?.files || !e.target.files[0]) {
                          return;
                        }
                        field.onChange(e?.target?.files[0])
                        setImageUrlFromFile(e?.target?.files[0]);
                        setInputType("file");
                      }} type='file' />
                            
                    </div>
                </FormControl>
              <FormDescription >
                Should be a valid URL or a file
              </FormDescription>
              <FormMessage />

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
                  onChange={e => {
                    
                    field.onChange(e.target.valueAsNumber
                      
                      )}}

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
    </>
  )
}

export default AuctionForm;