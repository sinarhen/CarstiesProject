'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectSeparator
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

import { updateAuction } from '@/actions/auctionActions';
import { TEditAuctionFormSchema, Auction, editAuctionFormSchema } from '@/types';
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
import { Trash2 } from 'lucide-react';


const EditAuctionForm = ({initialValues} : {
  initialValues: Auction
}) => {
  const router = useRouter();
  const [openImageUrlDialog, setOpenImageUrlDialog] = useState(false);
  const [imageUrlDialogTempInput, setImageUrlDialogTempInput] = useState('');
  const [inputType, setInputType] = useState<'file' | 'url'>('file');
  const [tempSrcUrlForFile, setTempSrcUrlForFile] = useState<string | null>(null);

  const form = useForm<TEditAuctionFormSchema>({
    resolver: zodResolver(editAuctionFormSchema),
    defaultValues: {
      make: initialValues.make,
      model: initialValues.model,
      year: initialValues.year,
      mileage: initialValues.mileage,
      color: initialValues.color,
      imageUrl: initialValues.imageUrl,
    },
    mode: "onTouched",
  });

  async function onSubmit(values: TEditAuctionFormSchema){
    try {
      const formData = new FormData();
      if (inputType === 'file') {
      // There could be functionality to delete the image from cloudinary
      // but I don't want to do it now, because of time constraints

      formData.append('file', values?.imageUrl);
      formData.append('upload_preset', 'gwuh0xnp');
      const imageUploaded = await axios.post(
        'https://api.cloudinary.com/v1_1/dhnkvzuxk/image/upload',
        formData
      );
      values.imageUrl = imageUploaded.data.secure_url;
      console.log(imageUploaded.data.secure_url)
    }
    console.log("Updatable values: ", values);
    const res = await updateAuction(initialValues.id, values);
    if (res?.error) {
      toast.error(res.error.message || 'Something went wrong');
      return;
    }
    toast.success('Auction updated successfully');
    console.log(res);
    router.refresh();
  } catch (e: any) {
    toast.error(e?.message || 'Something went wrong');
  };
}
  const toogleImageUrlDialog = () => {
    setOpenImageUrlDialog(!openImageUrlDialog);
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
  console.log("Form state: ", form.formState)
  useEffect(() => {
    console.log("Year changed: ", form.getValues('year'))
  }, [form.getValues('year')])
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
            <FormItem className='col-span'>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Select onValueChange={(value) => {
                  try {
                    field.onChange(parseInt(value));
                  } catch (e) {
                    form.setError('year', {message: 'Invalid year'})
                  }

                }
                }>
                  <SelectTrigger>
                    <SelectValue placeholder={field.value ?? "Select year"}/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select year</SelectLabel>
                      <SelectSeparator/>
                      {Array.from({ length: currentYear - 1990 }, (_, i) => (
                        <SelectItem key={i} value={`${currentYear - i}`}>
                          {currentYear - i}
                        </SelectItem>
                      ))}
                  
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
              <FormDescription>
                Year of the car
              </FormDescription>
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
        <DialogFooter>

          <DialogClose asChild>
            <div className='mt-4 flex items-center'>
              <Button 
                disabled={form.formState.isSubmitting || form.formState.isValidating || !form.formState.isValid}
                isLoading={form.formState.isLoading || form.formState.isValidating } type="submit">Save Changes</Button>
              <Button className='ml-4'  type="submit" variant='destructive'>Cancel</Button>
            </div>
            
          </DialogClose>
          
        </DialogFooter>
        
        
      </form>
    </Form>

  )
}

export default EditAuctionForm;