'use client';

import React, { useState } from 'react'
import { AspectRatio } from '@/components/ui/aspect-ratio';
import CarImage from '@/components/CarImage';
import { useGallery } from '@/app/providers/GalleryProvider';


export default function ExtendableImage({imageUrl} : {imageUrl: string}) {

    
    const {openGallery, setOpenGallery, setGalleryImage} = useGallery();
    
    function onOpen(){
        setOpenGallery(true);
        setGalleryImage(
                <CarImage imageUrl={imageUrl} />
        );
    }

  return (
    <>
    <div onClick={onOpen} className='cursor-pointer relative'>
                    <CarImage 
                        imageUrl={imageUrl} />
            
    </div>
      
    </>
    )
}
